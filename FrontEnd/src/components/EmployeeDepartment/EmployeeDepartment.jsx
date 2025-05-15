function EmployeeDepartment({employees}) {
  if (employees.length === 0) {
    return <p style={{paddingLeft: '1rem'}}>Không có nhân viên nào.</p>;
  }
  return (
    <ul style={{paddingLeft: '1rem'}}>
      {employees.map((emp) => (
        <li key={emp.EmployeeID}>
          {emp.FullName} - {emp.Email}
        </li>
      ))}
    </ul>
  );
}

export default EmployeeDepartment;
