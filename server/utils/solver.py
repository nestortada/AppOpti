from __future__ import annotations

import time
from typing import Dict, Any, Tuple, List, Set
from pulp import (
    LpProblem,
    LpMaximize,
    LpVariable,
    LpBinary,
    LpInteger,
    lpSum,
    value,
    PULP_CBC_CMD,
    LpStatus,
)

def calculate_employees_by_group(Employees_G: Dict[str, List[str]]) -> Dict[str, str]:
    """Inverts Employees_G to get group by employee mapping."""
    employees_g = {}
    for group, members in Employees_G.items():
        for employee in members:
            employees_g[employee] = group
    return employees_g

def find_different_desks(assignments: List[Dict[str, str]]) -> List[str]:
    """Find employees who use different desks across days."""
    emp_desks = {}
    for asg in assignments:
        emp = asg['employee']
        desk = asg['desk']
        emp_desks.setdefault(emp, set()).add(desk)
    return [emp for emp, desks in emp_desks.items() if len(desks) > 1]

def find_lonely_members(assignments: List[Dict[str, str]], 
                       Employees_G: Dict[str, List[str]], 
                       meeting_days: Dict[str, str]) -> List[Tuple[str, str, str, str]]:
    """Find employees alone in their zone during group meeting day."""
    lonely = []
    for group, day in meeting_days.items():
        zone_members = {}
        group_asgs = [a for a in assignments if a['day'] == day and a['employee'] in Employees_G.get(group, [])]
        for asg in group_asgs:
            zone = asg['zone']
            zone_members.setdefault(zone, []).append(asg['employee'])
        
        for zone, members in zone_members.items():
            if len(members) == 1:
                lonely.append((group, members[0], day, zone))
    return lonely

def find_violated_preferences(assignments: List[Dict[str, str]], Days_E: Dict[str, List[str]]) -> List[Tuple[str, str, str]]:
    """Find assignments that violate employee day preferences. Returns preferences as comma-separated string."""
    violated = []
    for asg in assignments:
        emp = asg['employee']
        day = asg['day']
        if emp in Days_E and day not in Days_E[emp]:
            prefs = Days_E[emp]
            if isinstance(prefs, (list, tuple)):
                prefs = ', '.join(map(str, prefs))
            else:
                prefs = str(prefs)
            violated.append((emp, day, prefs))
    return violated

def find_unused_desks(assignments: List[Dict[str, str]], Desks: List[str], Days: List[str]) -> List[Tuple[str, str, str]]:
    """Find desks that were not used on each day."""
    used = {(asg['desk'], asg['day']) for asg in assignments}
    unused = []
    for desk in Desks:
        for day in Days:
            if (desk, day) not in used:
                unused.append((desk, day, "Este puesto no se utilizó durante toda la semana"))
    return unused

def run_optimization(data: Dict[str, Any], min_attendance: int) -> Dict[str, Any]:
    """
    Versión optimizada con todos los KPIs y métricas de grupos juntos/solos correctamente calculadas.
    """
    # 1. Datos de entrada
    Employees   = data['Employees']
    Desks       = data['Desks']
    Days        = data['Days']
    Groups      = data['Groups']
    Zones       = data['Zones']
    Desks_Z     = data['Desks_Z']
    Employees_G = data['Employees_G']
    Days_E      = data['Days_E']
    Desks_E     = data['Desks_E']

    # 2. Precomputaciones
    pref = {(e, t): int(t in Days_E.get(e, [])) for e in Employees for t in Days}
    valid_x = [(e, d, t) for e in Employees for d in Desks_E.get(e, []) for t in Days]
    group_size = {g: len(Employees_G.get(g, [])) for g in Groups}

    # 3. Pesos
    W_extra   = 5
    W_notpref = 8
    W_iso     = 60
    W_change  = 10

    # 4. Definición del problema
    prob = LpProblem('AsignacionPuestos', LpMaximize)

    # 5. Variables de decisión
    x = {idx: LpVariable(f"x_{idx[0]}_{idx[1]}_{idx[2]}", cat=LpBinary) for idx in valid_x}
    u = {(e, d): LpVariable(f"u_{e}_{d}", cat=LpBinary) for e in Employees for d in Desks_E.get(e, [])}
    m = {(g, t): LpVariable(f"m_{g}_{t}", cat=LpBinary) for g in Groups for t in Days}
    n = {(g, z, t): LpVariable(f"n_{g}_{z}_{t}", lowBound=0, cat=LpInteger) for g in Groups for z in Zones for t in Days}
    solo = {(g, z, t): LpVariable(f"solo_{g}_{z}_{t}", cat=LpBinary) for g in Groups for z in Zones for t in Days}

    # 6. Función objetivo
    prob += (
        W_extra * lpSum(x.values())
      - W_notpref * lpSum((1 - pref[e, t]) * var for (e, d, t), var in x.items())
      - W_iso   * lpSum(solo.values())
      - W_change * lpSum(u.values())
    )

    # 7. Restricciones
    # R1 & R1b: 1 desk/empleado/día y 1 empleado/desk/día
    for t in Days:
        for e in Employees:
            prob += lpSum(x.get((e, d, t), 0) for d in Desks_E.get(e, [])) <= 1
        for d in Desks:
            prob += lpSum(x.get((e, d, t), 0) for e in Employees) <= 1
    # R2: asistencia mínima semanal
    for e in Employees:
        prob += lpSum(x.get((e, d, t), 0) for (e2, d, t) in valid_x if e2 == e) >= min_attendance
    # R3: un día de reunión por grupo
    for g in Groups:
        prob += lpSum(m[g, t] for t in Days) == 1
    # R4: asistencia obligatoria al día de reunión
    for g in Groups:
        for e in Employees_G.get(g, []):
            for t in Days:
                prob += lpSum(x.get((e, d, t), 0) for d in Desks_E.get(e, [])) >= m[(g, t)]
    # R5: conteo por zona y día
    for g in Groups:
        for z in Zones:
            for t in Days:
                prob += n[g, z, t] == lpSum(x.get((e, d, t), 0) for e in Employees_G.get(g, []) for d in Desks_Z.get(z, []))
    # R6: aislamiento
    for g in Groups:
        M_g = group_size[g]
        for z in Zones:
            for t in Days:
                prob += solo[g, z, t] <= m[g, t]
                prob += n[g, z, t] <= 1 + M_g * (1 - solo[g, z, t])
                prob += n[g, z, t] >= solo[g, z, t]
    # R7: relación u-x
    for (e, d, t), var in x.items(): prob += u[(e, d)] >= var
    for (e, d), uv in u.items(): prob += lpSum(x.get((e, d, t), 0) for t in Days) <= len(Days) * uv

    # 8. Resolver
    begin_time = time.time()
    prob.solve(PULP_CBC_CMD(msg=False, threads=0 ))
    end_time = time.time()
    print(f"Optimization completed in {end_time - begin_time:.2f} seconds")

    # 9. Extracción de resultados
    assignments = [{'employee': e, 'desk': d, 'day': t, 'zone': next(z for z in Zones if d in Desks_Z[z])} 
                  for (e, d, t), var in x.items() if var.value() == 1]

    # 10. Cálculo de KPIs
    total_asgn = len(assignments)
    total_slots = len(Desks) * len(Days)
    weekly_desk_occupancy = total_asgn / total_slots if total_slots else 0
    total_x = sum(var.value() for var in x.values())
    nonpref_sum = sum((1 - pref[e, t]) * x[(e, d, t)].value() for (e, d, t) in valid_x)
    non_preferred_pct = nonpref_sum / total_x if total_x else 0
    emp_assigned = sum(1 for e in Employees if any(x.get((e, d, t), 0).value() == 1 for d in Desks_E.get(e, []) for t in Days))
    assigned_pct = emp_assigned / len(Employees) if Employees else 0
    # Métricas de grupos en reunión
    attendees = 0
    alone_count = 0
    together_count = 0
    group_zones_table: List[Dict[str, Any]] = []
    for g in Groups:
        meet = next((t for t in Days if m[g, t].value() == 1), None)
        if meet is None: continue
        zones_count: Dict[str, int] = {}
        # contar asistentes por zona
        for (e, d, t), var in x.items():
            if t == meet and var.value() == 1 and e in Employees_G.get(g, []):
                zsel = next(z for z in Zones if d in Desks_Z[z])
                zones_count[zsel] = zones_count.get(zsel, 0) + 1
        # tabla por grupo
        group_zones_table.append({'group': g, 'day': meet, 'zones': ', '.join(zones_count.keys()), 'cantidad': ', '.join(str(zones_count[z]) for z in zones_count)})
        # métricas juntos/solos
        for cnt in zones_count.values():
            attendees += cnt
            if cnt == 1:
                alone_count += 1
            elif cnt >= 2:
                together_count += cnt
    solo_pct = alone_count / attendees if attendees else 0
    groups_together_pct = together_count / attendees if attendees else 0
    same_desk_count = sum(1 for e in Employees if sum(u[(e, d)].value() for d in Desks_E.get(e, [])) == 1)
    same_desk_pct = same_desk_count / len(Employees) if Employees else 0
    score = value(prob.objective) or 0

    # 11. Cálculo de métricas adicionales
    employees_g = calculate_employees_by_group(Employees_G)
    different_desks = find_different_desks(assignments)
    
    # Extract meeting days from m variables
    meeting_days = {g: next(t for t in Days if m[g, t].value() == 1) for g in Groups}
    
    lonely_members = find_lonely_members(assignments, Employees_G, meeting_days)
    violated_preferences = find_violated_preferences(assignments, Days_E)
    unused_desks = find_unused_desks(assignments, Desks, Days)

    results = {
        'assignments': assignments,
        'group_zones_table': group_zones_table,
        'kpis': {
            'score': round(score, 2),
            'non_preferred_pct': round(non_preferred_pct, 2),
            'assigned_pct': round(assigned_pct, 2),
            'solo_pct': round(solo_pct, 2),
            'groups_together_pct': round(groups_together_pct, 2),
            'weekly_desk_occupancy': round(weekly_desk_occupancy, 2),
            'same_desk_pct': round(same_desk_count / len(Employees) if Employees else 0, 2),
        },
        'status': LpStatus[prob.status],
        'employees_g': employees_g,
        'meeting_days': meeting_days,
        'different_desks': different_desks,
        'lonely_members': lonely_members,
        'violated_preferences': violated_preferences,
        'unused_desks': unused_desks
    }

    return results
