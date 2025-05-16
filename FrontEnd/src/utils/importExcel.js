import * as XLSX from 'xlsx';

export const importEmployeesFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet);

      const employees = json.map((row) => ({
        EmployeeID: row['Mã NV'],
        FullName: row['Họ tên'],
        Gender: row['Giới tính'],
        DateOfBirth: convertExcelDate(row['Ngày sinh']),
        PhoneNumber: sanitizePhone(row['SĐT']),
        Email: row['Email'],
        HireDate: convertExcelDate(row['Ngày vào làm']),
        Status: row['Trạng thái'],
        DepartmentName: row['Phòng ban'],
        PositionName: row['Chức vụ'],
        Img_url: row['Ảnh'] || null,
      }));

      resolve(employees);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

function convertExcelDate(value) {
  if (!value) return null;

  if (typeof value === 'number') {
    const jsDate = XLSX.SSF.parse_date_code(value);
    if (!jsDate) return null;
    // Trả về định dạng yyyy-MM-dd
    return `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
  }

  if (typeof value === 'string') {
    // Giả sử dạng ngày là dd-mm-yyyy hoặc dd/mm/yyyy
    const parts = value.split(/[-/]/);
    if (parts.length === 3) {
      let [d, m, y] = parts;
      d = parseInt(d, 10);
      m = parseInt(m, 10);
      y = parseInt(y, 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        const date = new Date(y, m - 1, d);
        if (!isNaN(date)) {
          return date.toISOString().split('T')[0]; // yyyy-MM-dd
        }
      }
    }
    return null;
  }

  return null;
}

function sanitizePhone(phone) {
  if (!phone) return null;
  let phoneStr = String(phone).trim();
  phoneStr = phoneStr.replace(/[^\d+]/g, '');
  return phoneStr.length > 0 ? phoneStr : null;
}
