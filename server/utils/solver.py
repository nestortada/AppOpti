from __future__ import annotations

from typing import Dict, Any, Tuple
from pulp import LpProblem, LpMaximize, LpVariable, LpBinary, LpInteger, lpSum, value, PULP_CBC_CMD


def run_optimization(data: Dict[str, Any], min_attendance: int) -> Dict[str, Any]:
    Employees   = data['Employees']
    Desks       = data['Desks']
    Days        = data['Days']
    Groups      = data['Groups']
    Zones       = data['Zones']
    Desks_Z     = data['Desks_Z']      # mapas zona → lista de desks
    Desks_E     = data['Desks_E']      # mapas empleado → lista de desks compatibles
    Employees_G = data['Employees_G']  # mapas grupo → lista de empleados
    Days_E      = data['Days_E']       # mapas empleado → lista de días preferidos

    # 2. Construir compatibilidad y preferencia
    compat = {
        (e, d): 1 if d in Desks_E[e] else 0
        for e in Employees for d in Desks
    }
    pref = {
        (e, t): 1 if t in Days_E[e] else 0
        for e in Employees for t in Days
    }

    # 3. Parámetros del modelo
    M = len(Desks)  # big-M
    # Ajusta estos pesos según tu prioridad
    W1 = 100  # cobertura mínima
    W2 =   5  # días extra
    W3 =  10  # penalización por día no preferido
    W4 =   1  # penalización aislamiento en día de reunión
    W5 =   1  # penalización por cambiar de puesto

    # 4. Crear problema
    prob = LpProblem('AsignacionPuestos', LpMaximize)

    # 5. Variables
    x      = LpVariable.dicts('x',      (Employees, Desks, Days),       cat=LpBinary)
    w      = LpVariable.dicts('w',      (Employees, Days),              cat=LpBinary)
    m      = LpVariable.dicts('m',      (Groups, Days),                 cat=LpBinary)
    y      = LpVariable.dicts('y',      Employees,                      cat=LpBinary)
    u      = LpVariable.dicts('u',      (Employees, Desks),             cat=LpBinary)
    puesto = LpVariable.dicts('puesto', Employees,                      cat=LpBinary)
    solo   = LpVariable.dicts('solo',   (Groups, Zones, Days),          cat=LpBinary)
    n      = LpVariable.dicts('n',      (Groups, Zones, Days), lowBound=0, cat=LpInteger)
    k      = LpVariable.dicts('k',      Employees,                      lowBound=0, cat=LpInteger)

    # 6. Función objetivo
    prob += (
        W1 * lpSum(y[e]           for e in Employees)
      + W2 * lpSum(k[e]           for e in Employees)
      - W3 * lpSum((1 - pref[e,t]) * w[e][t]
                  for e in Employees for t in Days)
      - W4 * lpSum(solo[g][z][t]
                  for g in Groups for z in Zones for t in Days)
      - W5 * lpSum((1 - puesto[e]) for e in Employees)
    )

    # 7. Restricciones

    # R0. Compatibilidad
    for e in Employees:
        for d in Desks:
            for t in Days:
                prob += x[e][d][t] <= compat[(e, d)]

    # R1. Capacidad de escritorio
    for d in Desks:
        for t in Days:
            prob += lpSum(x[e][d][t] for e in Employees) <= 1

    # R2. Coherencia asistencia–escritorio
    for e in Employees:
        for t in Days:
            prob += w[e][t] == lpSum(x[e][d][t] for d in Desks)

    # R3. Asistencia mínima (1 día)
    for e in Employees:
        prob += lpSum(w[e][t] for t in Days) >= min_attendance

    # R4. Indicador de cobertura
    for e in Employees:
        prob += y[e] * min_attendance <= lpSum(w[e][t] for t in Days)

    # R5. Un día de reunión por grupo
    for g in Groups:
        prob += lpSum(m[g][t] for t in Days) == 1

    # R6. Asistencia obligatoria a la reunión
    for g in Groups:
        for e in Employees_G[g]:
            for t in Days:
                prob += w[e][t] >= m[g][t]

    # R7. Detección de escritorio único
    for e in Employees:
        for d in Desks:
            for t in Days:
                prob += u[e][d] >= x[e][d][t]
        prob += lpSum(u[e][d] for d in Desks) <= 1 + M * (1 - puesto[e])

    # R8. Conteo de miembros por zona y día
    for g in Groups:
        for z in Zones:
            for t in Days:
                prob += (
                    n[g][z][t]
                    == lpSum(x[e][d][t]
                            for e in Employees_G[g]
                            for d in Desks_Z[z])
                )

    # R9. Aislamiento
    for g in Groups:
        for z in Zones:
            for t in Days:
                if m[g][t] == 1:
                    prob += n[g][z][t] <= 1 + M * (1 - solo[g][z][t])
                    prob += n[g][z][t] >= solo[g][z][t]

    # R10. Cálculo de días adicionales
    for e in Employees:
        prob += k[e] == lpSum(w[e][t] for t in Days) - 1

    prob.solve(PULP_CBC_CMD(msg=False))

    # 9. Construir resultados y KPIs
    assignments = [
        {"employee": e, "desk": d, "day": t}
        for e in Employees for d in Desks for t in Days
        if x[e][d][t].value() == 1
    ]

    total_w      = sum(w[e][t].value() for e in Employees for t in Days)
    non_pref_w   = sum((1 - pref[e, t]) * w[e][t].value() for e in Employees for t in Days)
    non_pref_pct = 0 if total_w == 0 else non_pref_w / total_w

    # Nuevo: porcentaje de eventos solo
    solo_count    = sum(solo[g][z][t].value() for g in Groups for z in Zones for t in Days)
    total_solo_av = len(Groups) * len(Zones) * len(Days)
    solo_pct      = 0 if total_solo_av == 0 else solo_count / total_solo_av

    assigned_pct = sum(y[e].value() for e in Employees) / len(Employees)

    result = {
        "assignments": assignments,
        "kpis": {
            "score":             value(prob.objective),
            "non_preferred_pct": non_pref_pct,
            "assigned_pct":      assigned_pct,
            "solo_pct":          solo_pct,
        },
    }
    return result
