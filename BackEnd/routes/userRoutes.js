const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

// ==================== AUTH & ACCOUNT ====================
router.post("/login", userController.login); // Đăng nhập
router.post("/loginByFace", userController.loginFace); // Đăng nhập bằng khuôn mặt
router.get("/getAccount", userController.getaccount); // Lấy danh sách tài khoản
router.post("/addAccount", userController.addAccount); // Thêm tài khoản
router.post("/resetPassword", userController.resetPassword); // Quên mật khẩu
router.post("/sendVerificationCode", userController.sendVerificationCode); // Gửi mã qua email
router.post("/toggleAccountStatus", userController.toggleAccountStatus); // Khoá/mở tài khoản

// ==================== EMPLOYEE ====================
router.get("/employees", userController.getAllEmployees); // Lấy danh sách nhân viên
router.get("/getemployees/:EmployeeID", userController.getEmployeeById); // Lấy nhân viên theo ID
router.post("/addUser", userController.addEmployee); // Thêm nhân viên
router.put("/employees/:EmployeeID", userController.updateEmployee); // Cập nhật nhân viên
router.delete("/employees/:EmployeeID", userController.deleteEmployee); // Xóa nhân viên
router.put("/updateMyProfile/:EmployeeID", userController.updateMyProfile); // Cập nhật profile
router.post("/import", userController.importExcel); // Import từ Excel

// ==================== DEPARTMENT ====================
router.get("/departments", userController.getAllDepartments); // Lấy danh sách phòng ban (MySQL)
router.get("/getDepartmentSql", userController.getAllDepartmentsSql); // Lấy phòng ban (SQL Server)
router.get("/getDepartment/:DepartmentID", userController.getDepartments); // Lấy phòng ban theo ID
router.delete("/deletedDepartments/:DepartmentID",userController.deleteDepartment); // Xóa phòng ban

// ==================== POSITION ====================
router.get("/positions", userController.getAllPositions); // Lấy danh sách chức vụ (MySQL)
router.get("/getPositionSql", userController.getAllPositionSql); // Lấy chức vụ (SQL Server)
router.post("/addPosition", userController.addPosition); // Thêm chức vụ
router.post("/updatePosition/:PositionID", userController.updatePosition); // Cập nhật chức vụ
router.delete("/deletePosition/:PositionID", userController.deletePosition); // Xóa chức vụ

// ==================== SALARY ====================
router.get("/getsalaries", userController.getsalaries); // Lấy danh sách lương
router.get("/getEmployeeSalari", userController.getEmployees); // Lấy lương theo nhân viên
router.get("/getSalaryByEmployeeID", userController.getSalariById); // Lấy lương theo ID nhân viên
router.post("/addsalary", userController.addSalary); // Thêm lương
router.put("/updatesalary/:salaryID", userController.updateSalary); // Cập nhật lương
router.delete("/deletesalary/:salaryID", userController.deleteSalary); // Xóa lương
router.get("/getMonthlySalaryReport", userController.getMonthlySalaryReport); // Báo cáo lương tháng
router.post("/sendPayroll", userController.sendPayroll); // Gửi bảng lương

// ==================== TIMEKEEPING (CHẤM CÔNG) ====================
router.post("/addTimekeeping", userController.addTimekeeping); // Chấm công
router.get(
  "/getTimekeepingByEmployee/:EmployeeID",
  userController.getTimekeepingByEmployee
); // Chấm công theo nhân viên
router.get(
  "/getAttendanceByEmployeeID",
  userController.getAttendanceByEmployeeID
); // Chấm công nhân viên (khác?)
router.get("/getAllAttendance", userController.getAllAttendance); // Danh sách chấm công

// ==================== DASHBOARD - THỐNG KÊ ====================
router.get("/gettotalEmployees", userController.gettotalEmployees); // Tổng nhân viên
router.get("/gettotalDepartment", userController.gettotalDepartment); // Tổng phòng ban
router.get("/gettotalSalary", userController.gettotalSalary); // Tổng lương
router.get("/getCountStatus", userController.getCountStatus); // Thống kê trạng thái nhân viên
router.get("/getCountGender", userController.getCountGender); // Thống kê giới tính nhân viên
router.get("/totalPosition", userController.totalPosition); //Thống kê sô lươngj nhân viên tuỳ chức vụ

// ==================== KHÁC ====================
router.get("/notifications", userController.getNotifications); // Lấy thông báo
router.get("/getRole", userController.getRole); // Lấy vai trò

module.exports = router;
