const MASTER_CODES = [
  "CQ2*4",
  "CQ2*6",
  "CQ2*10",
  "CQ2*12",
  "CQ2*16",
  "CQ2*20",
  "CQ2*25",
  "CQ2*32",
  "CQ2*40",
  "CQ2*50",
  "CQ2*63",
  "CQ2*80",
  "CQ2*100",
  "CQ2*125",
  "CQ2*140",
  "CQ2*160",
  "CQ2*180",
  "CQ2*200",
  "CQ",
  "CG1*20",
  "CG1*25",
  "CG1*32",
  "CG1*40",
  "CG1*50",
  "CG1*63",
  "CG1*80",
  "CG1*100",
  "CG",
  "CK1*32",
  "CK1*40",
  "CK1*50",
  "CK1*63",
  "CK1*80",
  "CK",
  "CJ2*6",
  "CJ2*4",
  "CJ2*8",
  "CJ2*10",
  "CJ2*12",
  "CJ2*16",
  "CJ2*25",
  "NCM*44",
  "NCM*56",
  "CJ",
  "CM2*20",
  "CM2*25",
  "CM2*32",
  "CM2*40",
  "CM2*50",
  "CM",
  "MB*100",
  "MB*125",
  "MB*32",
  "MB*40",
  "MB*50",
  "MB*63",
  "MB*80",
  "MB",
  "CA*100",
  "CA*32",
  "CA*40",
  "CA*50",
  "CA*63",
  "CA*80",
  "CA",
  "C96*100",
  "C96*32",
  "C96*40",
  "C96*50",
  "C96*63",
  "C96*80",
  "C96",
  "MGP/Q*6",
  "MGP/Q*10",
  "MGP/Q*12",
  "MGP/Q*16",
  "MGP/Q*20",
  "MGP/Q*25",
  "MGP/Q*32",
  "MGP/Q*40",
  "MGP/Q*50",
  "MGP/Q*63",
  "MGP/Q*80",
  "MGP/Q*100",
  "MGP/Q",
  "CU*4",
  "CU*8",
  "CU*6",
  "CU*10",
  "CU*12",
  "CU*16",
  "CU*20",
  "CU*25",
  "CU*32",
  "CU",
  "CXS*6",
  "CXS*10",
  "CXS*15",
  "CXS*16",
  "CXS*20",
  "CXS*25",
  "CXS*32",
  "CXS*50",
  "CXS*63",
  "CXS*80",
  "CXS",
  "MK*12",
  "MK*16",
  "MK*20",
  "MK*25",
  "MK*32",
  "MK*40",
  "MK*50",
  "MK*63",
  "MK",
  "RS*6",
  "RS*10",
  "RS*12",
  "RS*16",
  "RS*20",
  "RS*25",
  "RS*32",
  "RS*40",
  "RS*50",
  "RS*63",
  "RS*80",
  "RS",
  "MXH*6",
  "MXH*8",
  "MXH*10",
  "MXH*12",
  "MXH*16",
  "MXH*20",
  "MXH*25",
  "MXH",
  "CKZ*40",
  "CKZ*50",
  "CKZ*63",
  "CKZ*80",
  "CKZ",
  "MXQ*-A06*",
  "MXQ*-A08*",
  "MXQ*-A12*",
  "MXQ*-A16*",
  "MXQ*-A20*",
  "MXQ*-A25*",
  "MXQ/S",
  "MXS06*",
  "MXS08*",
  "MXS12*",
  "MXS16*",
  "MXS20*",
  "MXS25*",
  "MH10*",
  "MH16*",
  "MH20*",
  "MH25*",
  "MH32*",
  "MH40*",
  "MH50*",
  "MHZ",
  "CY6*",
  "CY10*",
  "CY15*",
  "CY20*",
  "CY25*",
  "CY32*",
  "CY40*",
  "CY50*",
  "CY63*",
  "CY",
  "MY10*",
  "MY16*",
  "MY20*",
  "MY25*",
  "MY32*",
  "MY40*",
  "MY50*",
  "MY63*",
  "MY80*",
  "MY",
  "L*8",
  "L*10",
  "L*16",
  "L*25",
  "L*32",
  "L*40",
  "L*63",
  "L*"
];

const DEFECT_OPTIONS = [
  "Lỗi vận hành",
  "Lỗi giảm chấn",
  "Rò rỉ bên trong",
  "Rò rỉ bên ngoài",
  "Hành trình",
  "Khác"
];

const REASON_OPTIONS = [
  "Dầu",
  "Linh kiện",
  "Mạt cắt / Phoi",
  "Thiết bị",
  "Rổ khí / Lỗ rổ",
  "Gioăng / Phớt",
  "Kim (van kim)",
  "Rác / Dị vật",
  "Lỗi cán / Lỗi rolling",
  "Ngoại quan",
  "Khác"
];


const LINE_OPTIONS = [
  "CM Serier",
  "CJ Serier",
  "CU Serier",
  "MGP Serier",
  "CQ Series",
  "CA,C96,MB Series",
  "CKZ Series",
  "CG Series",
  "CK Series",
  "MXQ Series",
  "MXS Series",
  "LEY Series",
  "LEF Series",
  "MY Series",
  "CY Series",
  "RS Series"
];

const API_RECORDS_URL = "/api/records";
const records = [];

const form = document.getElementById("ngForm");
const tableBody = document.querySelector("#recordsTable tbody");
const clearBtn = document.getElementById("clearBtn");
const exportExcelBtn = document.getElementById("exportExcelBtn");
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");
const lineFilter = document.getElementById("lineFilter");
const resetFilterBtn = document.getElementById("resetFilterBtn");
const filterHint = document.getElementById("filterHint");

const lineSelect = document.getElementById("line");
const productSelect = document.getElementById("product");
const defectSelect = document.getElementById("defectType");
const reasonSelect = document.getElementById("reason");

let productChart;
let defectChart;
let trendChart;

function unique(list) {
  return [...new Set(list)];
}

function fillSelect(selectEl, options) {
  const existingDefault = selectEl.querySelector('option[value=""]');
  const defaultOption = existingDefault ? existingDefault.outerHTML : '<option value="">-- Chọn --</option>';
  selectEl.innerHTML = `${defaultOption}${options.map((v) => `<option value="${v}">${v}</option>`).join("")}`;
}

fillSelect(lineSelect, LINE_OPTIONS);
fillSelect(productSelect, unique(MASTER_CODES));
fillSelect(defectSelect, DEFECT_OPTIONS);
fillSelect(reasonSelect, REASON_OPTIONS);

async function fetchRecordsFromServer() {
  const response = await fetch(API_RECORDS_URL);
  if (!response.ok) throw new Error("Không tải được dữ liệu từ server.");
  const data = await response.json();
  records.length = 0;
  records.push(...(Array.isArray(data) ? data : []));
}

async function addRecordToServer(row) {
  const response = await fetch(API_RECORDS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row)
  });
  if (!response.ok) throw new Error("Không lưu được dữ liệu lên server.");
  const saved = await response.json();
  records.push(saved);
}

async function clearRecordsOnServer() {
  const response = await fetch(API_RECORDS_URL, { method: "DELETE" });
  if (!response.ok) throw new Error("Không xóa được dữ liệu trên server.");
  records.length = 0;
}

function getFilteredRecords() {
  return records.filter((row) => {
    if (!row.date) return false;
    const [year, month] = row.date.split("-");
    const matchYear = yearFilter.value === "ALL" || year === yearFilter.value;
    const matchMonth = monthFilter.value === "ALL" || month === monthFilter.value;
    const matchLine = lineFilter.value === "ALL" || row.line === lineFilter.value;
    return matchYear && matchMonth && matchLine;
  });
}

function renderTable() {
  tableBody.innerHTML = records
    .map(
      (r) => `
      <tr>
        <td>${r.date}</td>
        <td>${r.line}</td>
        <td>${r.product}</td>
        <td>${r.defectType}</td>
        <td>${r.reason}</td>
        <td>${r.qty}</td>
      </tr>`
    )
    .join("");
}

function aggregateBy(items, key) {
  return items.reduce((acc, row) => {
    acc[row[key]] = (acc[row[key]] || 0) + Number(row.qty || 0);
    return acc;
  }, {});
}

function aggregateTrend(items) {
  return items.reduce((acc, row) => {
    acc[row.date] = (acc[row.date] || 0) + Number(row.qty || 0);
    return acc;
  }, {});
}

function destroyChartIfNeeded(chart) {
  if (chart) chart.destroy();
}

function renderFilterHint(total, filtered) {
  if (yearFilter.value === "ALL" && monthFilter.value === "ALL" && lineFilter.value === "ALL") {
    filterHint.textContent = `Đang hiển thị toàn bộ dữ liệu (${total} bản ghi).`;
    return;
  }
  const yearLabel = yearFilter.value === "ALL" ? "Tất cả năm" : `Năm ${yearFilter.value}`;
  const monthLabel = monthFilter.value === "ALL" ? "Tất cả tháng" : `Tháng ${monthFilter.value}`;
  const lineLabel = lineFilter.value === "ALL" ? "Tất cả line" : lineFilter.value;
  filterHint.textContent = `Đang lọc biểu đồ theo ${yearLabel} - ${monthLabel} - ${lineLabel} (${filtered}/${total} bản ghi).`;
}

function buildCharts() {
  destroyChartIfNeeded(productChart);
  destroyChartIfNeeded(defectChart);
  destroyChartIfNeeded(trendChart);

  const filteredRecords = getFilteredRecords();
  const productAgg = Object.entries(aggregateBy(filteredRecords, "product"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  productChart = new Chart(document.getElementById("productChart"), {
    type: "bar",
    data: {
      labels: productAgg.map((x) => x[0]),
      datasets: [{ label: "Số lỗi", data: productAgg.map((x) => x[1]), backgroundColor: "#0ea5e9" }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  const defectAgg = Object.entries(aggregateBy(filteredRecords, "defectType")).sort((a, b) => b[1] - a[1]);
  defectChart = new Chart(document.getElementById("defectChart"), {
    type: "pie",
    data: {
      labels: defectAgg.map((x) => x[0]),
      datasets: [
        {
          data: defectAgg.map((x) => x[1]),
          backgroundColor: ["#0ea5e9", "#14b8a6", "#f97316", "#8b5cf6", "#f59e0b", "#ef4444"]
        }
      ]
    }
  });

  const trendAgg = Object.entries(aggregateTrend(filteredRecords)).sort((a, b) => a[0].localeCompare(b[0]));
  trendChart = new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
      labels: trendAgg.map((x) => x[0]),
      datasets: [
        {
          label: "Tổng lỗi theo ngày",
          data: trendAgg.map((x) => x[1]),
          borderColor: "#0f172a",
          backgroundColor: "rgba(15, 23, 42, 0.15)",
          fill: true,
          tension: 0.3
        }
      ]
    }
  });

  renderFilterHint(records.length, filteredRecords.length);
}

function updateYearFilterOptions() {
  const years = unique(
    records
      .map((r) => (r.date || "").split("-")[0])
      .filter(Boolean)
      .sort()
  );
  const current = yearFilter.value;
  yearFilter.innerHTML = '<option value="ALL">Tất cả năm</option>';
  years.forEach((year) => {
    yearFilter.insertAdjacentHTML("beforeend", `<option value="${year}">${year}</option>`);
  });

  if (years.includes(current)) {
    yearFilter.value = current;
  } else {
    yearFilter.value = "ALL";
  }
}


function updateLineFilterOptions() {
  const availableLines = unique([...LINE_OPTIONS, ...records.map((r) => r.line).filter(Boolean)]);
  const current = lineFilter.value;
  lineFilter.innerHTML = '<option value="ALL">Tất cả line</option>';
  availableLines.forEach((line) => {
    lineFilter.insertAdjacentHTML("beforeend", `<option value="${line}">${line}</option>`);
  });

  if (availableLines.includes(current)) {
    lineFilter.value = current;
  } else {
    lineFilter.value = "ALL";
  }
}

function exportToExcel() {
  if (records.length === 0) {
    alert("Chưa có dữ liệu để xuất Excel.");
    return;
  }

  if (typeof XLSX === "undefined") {
    alert("Không tải được thư viện xuất Excel. Vui lòng thử lại.");
    return;
  }

  const rows = records.map((r) => ({
    Ngày: r.date,
    Line: r.line,
    "Dòng sản phẩm": r.product,
    "Loại lỗi": r.defectType,
    "Nguyên nhân": r.reason,
    "Số lượng lỗi": Number(r.qty || 0)
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "NG_First_Pass");

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `ng-khi-first-pass-${timestamp}.xlsx`);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const row = {
    date: document.getElementById("date").value,
    line: lineSelect.value,
    product: productSelect.value,
    defectType: defectSelect.value,
    reason: reasonSelect.value,
    qty: Number(document.getElementById("qty").value)
  };

  try {
    await addRecordToServer(row);
    updateYearFilterOptions();
    updateLineFilterOptions();
    renderTable();
    buildCharts();
    form.reset();
    document.getElementById("qty").value = 1;
  } catch (error) {
    alert(error.message);
  }
});

clearBtn.addEventListener("click", async () => {
  try {
    await clearRecordsOnServer();
    updateYearFilterOptions();
    updateLineFilterOptions();
    renderTable();
    buildCharts();
  } catch (error) {
    alert(error.message);
  }
});

yearFilter.addEventListener("change", buildCharts);
monthFilter.addEventListener("change", buildCharts);
lineFilter.addEventListener("change", buildCharts);
resetFilterBtn.addEventListener("click", () => {
  yearFilter.value = "ALL";
  monthFilter.value = "ALL";
  lineFilter.value = "ALL";
  buildCharts();
});
exportExcelBtn.addEventListener("click", exportToExcel);

async function initApp() {
  try {
    await fetchRecordsFromServer();
    updateYearFilterOptions();
    updateLineFilterOptions();
    renderTable();
    buildCharts();
  } catch (error) {
    filterHint.textContent = "Không kết nối được server. Vui lòng chạy server.py";
  }
}

initApp();
