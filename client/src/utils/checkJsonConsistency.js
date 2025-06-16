export default function checkJsonConsistency(data) {
  const issues = [];
  if (!data) return issues;
  const employees = data.Employees || [];
  const days = data.Days_E || {};
  employees.forEach((e) => {
    if (!Array.isArray(days[e]) || days[e].length === 0) {
      issues.push(`Empleado ${e} sin días asignados`);
    }
  });
  return issues;
}
