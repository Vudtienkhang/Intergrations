import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportEmployeesToExcel = (data) => {
  const formatted = data.map(emp => ({
    "Mã NV": emp.EmployeeID,
    "Họ tên": emp.FullName,
    "Giới tính": emp.Gender,
    "Ngày sinh": new Date(emp.DateOfBirth).toLocaleDateString(),
    "SĐT": emp.PhoneNumber,
    "Email": emp.Email,
    "Ngày vào làm": new Date(emp.HireDate).toLocaleDateString(),
    "Trạng thái": emp.Status,
    "Phòng ban": emp.DepartmentName,
    "Chức vụ": emp.PositionName
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân viên");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, "Danh_sach_nhan_vien.xlsx");
};
