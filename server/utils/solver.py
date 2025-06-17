from __future__ import annotations

from typing import Dict, Any, Tuple

import pandas as pd
import numpy as np
from pulp import LpProblem, LpMaximize, LpVariable, LpBinary, LpInteger, lpSum, value, PULP_CBC_CMD


def run_optimization(data: Dict[str, Any], min_attendance: int) -> Dict[str, Any]:
    Employees = data['Employees']
    Desks = data['Desks']
    Days = data['Days']
    Groups = data['Groups']
    Zones = data['Zones']
    Desks_Z = data['Desks_Z']
    Desks_E = data['Desks_E']
    Employees_G = data['Employees_G']
    Days_E = data['Days_E']

    compat = {(e, d): 1 if d in Desks_E[e] else 0 for e in Employees for d in Desks}
    pref = {(e, t): 1 if t in Days_E[e] else 0 for e in Employees for t in Days}

    M = len(Desks)
    W1 = 100
    W2 = 5
    W3 = 10
    W4 = 1
    W5 = 1

    prob = LpProblem('AsignacionPuestos', LpMaximize)

    x = LpVariable.dicts('x', (Employees, Desks, Days), cat=LpBinary)
    w = LpVariable.dicts('w', (Employees, Days), cat=LpBinary)
    m = LpVariable.dicts('m', (Groups, Days), cat=LpBinary)
    y = LpVariable.dicts('y', Employees, cat=LpBinary)
    u = LpVariable.dicts('u', (Employees, Desks), cat=LpBinary)
    puesto = LpVariable.dicts('puesto', Employees, cat=LpBinary)
    solo = LpVariable.dicts('solo', (Groups, Zones, Days), cat=LpBinary)
    n = LpVariable.dicts('n', (Groups, Zones, Days), lowBound=0, cat=LpInteger)
    k = LpVariable.dicts('k', Employees, lowBound=0, cat=LpInteger)

    prob += (
        W1 * lpSum(y[e] for e in Employees)
        + W2 * lpSum(k[e] for e in Employees)
        - W3 * lpSum((1 - pref[e, t]) * w[e][t] for e in Employees for t in Days)
        - W4 * lpSum(solo[g][z][t] for g in Groups for z in Zones for t in Days)
        - W5 * lpSum((1 - puesto[e]) for e in Employees)
    )

    for e in Employees:
        for d in Desks:
            for t in Days:
                prob += x[e][d][t] <= compat[(e, d)]

    for d in Desks:
        for t in Days:
            prob += lpSum(x[e][d][t] for e in Employees) <= 1

    for e in Employees:
        for t in Days:
            prob += w[e][t] == lpSum(x[e][d][t] for d in Desks)

    for e in Employees:
        prob += lpSum(w[e][t] for t in Days) >= min_attendance

    for e in Employees:
        prob += y[e] <= lpSum(w[e][t] for t in Days)

    for g in Groups:
        prob += lpSum(m[g][t] for t in Days) == 1

    for g in Groups:
        for e in Employees_G[g]:
            for t in Days:
                prob += w[e][t] >= m[g][t]

    for e in Employees:
        for d in Desks:
            for t in Days:
                prob += u[e][d] >= x[e][d][t]
        prob += lpSum(u[e][d] for d in Desks) <= 1 + M * (1 - puesto[e])

    for g in Groups:
        for z in Zones:
            for t in Days:
                prob += n[g][z][t] == lpSum(x[e][d][t] for e in Employees_G[g] for d in Desks_Z[z])

    for g in Groups:
        for z in Zones:
            for t in Days:
                prob += n[g][z][t] <= 1 + M * (1 - solo[g][z][t])
                prob += n[g][z][t] >= solo[g][z][t]

    for e in Employees:
        prob += k[e] == lpSum(w[e][t] for t in Days) - min_attendance

    prob.solve(PULP_CBC_CMD(msg=False))

    assignments = [
        {"employee": e, "desk": d, "day": t}
        for e in Employees for d in Desks for t in Days if x[e][d][t].value() == 1
    ]

    total_w = sum(w[e][t].value() for e in Employees for t in Days)
    pref_w = sum(w[e][t].value() * pref[e, t] for e in Employees for t in Days)
    pref_pct = 0 if total_w == 0 else pref_w / total_w
    assigned_pct = sum(y[e].value() for e in Employees) / len(Employees)

    result = {
        "assignments": assignments,
        "kpis": {
            "score": value(prob.objective),
            "preferences": pref_pct,
            "assigned": assigned_pct,
        },
    }
    return result
