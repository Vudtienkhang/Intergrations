const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");



// ==================== AUTH & ACCOUNT ====================
router.post("/login", userController.login); // Đăng nhập
router.get("/getAccount", userController.getaccount); // Lấy danh sách tài khoản
router.post("/addAccount", userController.addAccount); // Thêm tài khoản
router.post("/resetPassword", userController.resetPassword); // quên mật khẩu


// ==================== EMPLOYEE ====================
router.get("/employees", userController.getAllEmployees); // Lấy danh sách nhân viên
router.get("/getemployees/:EmployeeID", userController.getEmployeeById); // Lấy nhân viên theo ID
router.post("/addUser", userController.addEmployee); // Thêm nhân viên
router.put("/employees/:EmployeeID",userController.updateEmployee); // Cập nhật nhân viên
router.delete("/employees/:EmployeeID", userController.deleteEmployee); // Xóa nhân viên

// ==================== DEPARTMENT ====================
router.get("/departments", userController.getAllDepartments); // Lấy danh sách phòng ban
router.get("/getDepartmentSql", userController.getAllDepartmentsSql); // Lấy phòng ban từ SQL
router.get("/getDepartment/:DepartmentID", userController.getDepartments); // Lấy phòng ban theo ID
router.delete("/deletedDepartments/:DepartmentID",userController.deleteDepartment); // Xóa phòng ban

// ==================== POSITION ====================
router.get("/positions", userController.getAllPositions); // Lấy danh sách chức vụ
router.get("/getPositionSql", userController.getAllPositionSql); // Lấy chức vụ từ SQL
router.post("/addPosition", userController.addPosition); // Thêm chức vụ
router.post("/updatePosition/:PositionID", userController.updatePosition); // Cập nhật chức vụ
router.delete("/deletePosition/:PositionID", userController.deletePosition); // Xóa chức vụ

// ==================== SALARY ====================
router.get("/getsalaries", userController.getsalaries); // Lấy danh sách lương
router.get("/getEmployeeSalari", userController.getEmployees); // Lấy lương theo nhân viên
router.post("/addsalary", userController.addSalary); // Thêm lương
router.put("/updatesalary/:salaryID", userController.updateSalary); // Cập nhật lương
router.delete("/deletesalary/:salaryID", userController.deleteSalary); // Xóa lương
router.get("/getMonthlySalaryReport", userController.getMonthlySalaryReport); // Báo cáo lương theo tháng

// ==================== DASHBOARD - TỔNG QUAN ====================
router.get("/gettotalEmployees", userController.gettotalEmployees); // Tổng số nhân viên
router.get("/gettotalDepartment", userController.gettotalDepartment); // Tổng số phòng ban
router.get("/gettotalSalary", userController.gettotalSalary); // Tổng lương

// ==================== KHÁC ====================
router.get("/notifications", userController.getNotifications); // Lấy thông báo
router.get("/getRole", userController.getRole); // Lấy vai trò
router.post("/addTimekeeping", userController.addTimekeeping);//Chấm công
router.get("/getAttendanceByEmployeeID", userController.getAttendanceByEmployeeID)
router.get("/getSalaryByEmployeeID", userController.getSalariById)
router.get("/getAllAttendance", userController.getAllAttendance)
router.put("/updateMyProfile/:EmployeeID", userController.updateMyProfile)
router.post("/import", userController.importExcel)
router.get("/getCountStatus", userController.getCountStatus)
router.get("/getCountGender", userController.getCountGender)
router.post("/sendVerificationCode", userController.sendVerificationCode);

module.exports = router;
