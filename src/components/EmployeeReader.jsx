import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { utils, writeFile } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

function EmployeeReader() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDept, setSelectedDept] = useState("Tất cả");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    fetch("/data/danhsach.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const wb = XLSX.read(buffer, { type: "buffer" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi đọc Excel:", err);
        setLoading(false);
      });
  }, []);

  const departmentList = ["Tất cả", ...Array.from(new Set(employees.map(e => e.Department_ID).filter(Boolean)))];

  const filteredEmployees = employees.filter((e) => {
    const matchDept = selectedDept === "Tất cả" || e.Department_ID === selectedDept;
    const matchName = e.Person_Name?.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = e.Person_Status?.toLowerCase().includes(searchStatus.toLowerCase());
    return matchDept && matchName && matchStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentData = filteredEmployees.slice(startIndex, startIndex + perPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const day = String(date_info.getDate()).padStart(2, '0');
    const month = String(date_info.getMonth() + 1).padStart(2, '0');
    const year = date_info.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function exportToExcel() {
    const ws = utils.json_to_sheet(filteredEmployees);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Employees");
    writeFile(wb, "Employees.xlsx");
  }

  function exportToPDF() {
    const doc = new jsPDF();
    doc.text("Danh sách nhân viên", 14, 10);
    doc.autoTable({
      head: [["Person ID", "Name", "Status", "Department"]],
      body: filteredEmployees.map(e => [
        e.Person_ID,
        e.Person_Name,
        e.Person_Status,
        e.Department_ID
      ]),
      startY: 20,
      styles: { fontSize: 8 }
    });
    doc.save("Employees.pdf");
  }

  return (
    <div>
      <h2>Danh sách nhân viên ({filteredEmployees.length} dòng)</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Bộ lọc */}
          <div style={{ margin: "10px 0" }}>
            <label>
              Số dòng mỗi trang:
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ margin: "0 10px" }}
              >
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={800}>800</option>
                <option value={1000}>1000</option>
              </select>
            </label>

            <label>
              Đơn vị:
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ marginLeft: "10px" }}
              >
                {departmentList.map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Tìm kiếm nâng cao */}
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Tìm theo tên"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <input
              type="text"
              placeholder="Tìm theo trạng thái"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            />
          </div>

          {/* Nút xuất file */}
          <div style={{ marginBottom: "10px" }}>
            <button onClick={exportToExcel}>Xuất Excel</button>
            <button onClick={exportToPDF} style={{ marginLeft: "10px" }}>Xuất PDF</button>
          </div>

          {/* Bảng dữ liệu */}
          <table border="1" cellPadding="4" style={{ fontSize: "12px", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Person ID</th>
                <th>Person Name</th>
                <th>Birthday</th>
                <th>ID</th>
                <th>ID Day</th>
                <th>Person Status</th>
                <th>Mobilephone Number</th>
                <th>Department ID</th>
                <th>Education</th>
                <th>Staying Address</th>
                <th>Address Live</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={row.ImageURL}
                      alt={row.Person_Name}
                      width="50"
                      height="50"
                      onClick={() => setPopupImage(row.ImageURL)}
                      style={{ objectFit: "cover", borderRadius: "50%", cursor: "pointer" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                  </td>
                  <td>{row.Person_ID}</td>
                  <td>{row.Person_Name}</td>
                  <td>{typeof row.Birthday === "number" ? excelDateToJSDate(row.Birthday) : row.Birthday}</td>
                  <td>{row.ID}</td>
                  <td>{typeof row.ID_Day === "number" ? excelDateToJSDate(row.ID_Day) : row.ID_Day}</td>
                  <td>{row.Person_Status}</td>
                  <td>{row.Mobilephone_Number}</td>
                  <td>{row.Department_ID}</td>
                  <td>{row.Education}</td>
                  <td>{row.Staying_Address}</td>
                  <td>{row.Address_Live}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              ◀ Trang trước
            </button>
            <span style={{ margin: "0 10px" }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Trang sau ▶
            </button>
          </div>

          {/* Popup ảnh */}
          {popupImage && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
              onClick={() => setPopupImage(null)}
            >
              <img src={popupImage} alt="Ảnh lớn" style={{ maxWidth: "90%", maxHeight: "90%" }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmployeeReader;
