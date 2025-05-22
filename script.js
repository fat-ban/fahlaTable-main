let logoData = "";
let tableOrientation = "horizontal"; // Default orientation

document.getElementById("logoUpload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    logoData = event.target.result;
    document.getElementById("logoPreview").src = logoData;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function setTableOrientation(orientation) {
  tableOrientation = orientation;
  generateTable(); // Regenerate table with new orientation
}

function showSuccessToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#4CAF50",
    stopOnFocus: true
  }).showToast();
}

function showErrorToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#f44336",
    stopOnFocus: true
  }).showToast();
}

function generateTable() {
  try {
    // Get and trim input values
    const columnsInput = document.getElementById("columnsInput").value.trim();
    const dataInput = document.getElementById("dataInput").value.trim();
    
    console.log("Columns input:", columnsInput);
    console.log("Data input:", dataInput);

    // Validate required fields (check if empty strings)
    if (!columnsInput || !dataInput) {
      showErrorToast("املا بيانات الجدول.");
      document.getElementById("downloadButtons").style.display = "none";
      return;
    }

    // Process columns and data lines
    const columns = columnsInput.split(",").map((c) => c.trim());
    const dataLines = dataInput.split("\n").map(line => line.trim());
    
    console.log("Columns:", columns);
    console.log("Data lines:", dataLines);

    // Check if columns array is empty after processing
    if (columns.length === 0 || columns[0] === "") {
      showErrorToast("يجب إدخال أسماء الأعمدة مفصولة بفواصل");
      document.getElementById("downloadButtons").style.display = "none";
      return;
    }

    // Check if data lines array is empty after processing
    if (dataLines.length === 0 || dataLines[0] === "") {
      showErrorToast("يجب إدخال بيانات الجدول");
      document.getElementById("downloadButtons").style.display = "none";
      return;
    }

    // Validate number of columns matches data lines
    const expectedColumns = columns.length;
    for (const line of dataLines) {
      const cells = line.split(",");
      if (cells.length !== expectedColumns) {
        showErrorToast("عدد الأعمدة غير متطابق مع عدد الخلايا في السطور");
        document.getElementById("downloadButtons").style.display = "none";
        return;
      }
    }

    // Get other inputs
    const title = document.getElementById("headerTitle").value;
    const description = document.getElementById("headerDesc").value;
    const footer = document.getElementById("footerText").value;
    const tableContainer = document.getElementById("tableContainer");

    let html = '<div id="printContent">';
    if (title) html += `<h3>${title}</h3>`;
    if (description) html += `<p style="text-align:center;">${description}</p>`;
    if (logoData) {
      html += `<img src="${logoData}" style="max-height: 100px; display:block; margin:auto;" />`;
    }

    // Generate table based on orientation
    if (tableOrientation === "horizontal") {
      // Horizontal table (default)
      html += "<table><thead><tr>";
      columns.forEach((col) => (html += `<th>${col}</th>`));
      html += "</tr></thead><tbody>";

      dataLines.forEach((line) => {
        const parts = line.split(",").map(part => part.trim());
        html += "<tr>";
        for (let i = 0; i < columns.length; i++) {
          html += `<td contenteditable="true">${parts[i] || ""}</td>`;
        }
        html += "</tr>";
      });

      html += "</tbody></table>";
    } else {
      // Vertical table
      html += "<table>";
      
      for (let i = 0; i < columns.length; i++) {
        html += "<tr>";
        html += `<th>${columns[i]}</th>`;
        
        dataLines.forEach((line) => {
          const parts = line.split(",").map(part => part.trim());
          html += `<td contenteditable="true">${parts[i] || ""}</td>`;
        });
        
        html += "</tr>";
      }
      
      html += "</table>";
    }

    if (footer) html += `<div class="footer">${footer}</div>`;
    html += "</div>";

    tableContainer.innerHTML = html;
    
    // Show download buttons after successful table generation
    document.getElementById("downloadButtons").style.display = "flex";

    showSuccessToast("تم إنشاء الجدول بنجاح!");
  } catch(error) {
    showErrorToast("حدث خطأ: " + error.message);
    console.error("Error generating table:", error);
    document.getElementById("downloadButtons").style.display = "none";
  }
}

// Rest of your functions remain the same...
function saveAsJSON() {
   try {
    const columnsInput = document.getElementById("columnsInput").value.trim();
    const dataInput = document.getElementById("dataInput").value.trim();
    
    console.log("Columns input:", columnsInput);
    console.log("Data input:", dataInput);

    // Validate required fields (check if empty strings)
    if (!columnsInput || !dataInput) {
      showErrorToast("املا بيانات الجدول.");
      return;
    }
    const data = {
    columns: document.getElementById("columnsInput").value,
    data: document.getElementById("dataInput").value,
    headerTitle: document.getElementById("headerTitle").value,
    headerDesc: document.getElementById("headerDesc").value,
    footerText: document.getElementById("footerText").value,
    logoData: logoData,
    orientation: tableOrientation
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "table-data.json";
  link.click();
    
    showSuccessToast("تم حفظ الجدول بنجاح!");
  } catch (error) {
     showErrorToast("هناك خطاء: " + error.message);
  }
}

function loadFromJSON(input) {
  try {
   const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = JSON.parse(e.target.result);
    document.getElementById("columnsInput").value = content.columns;
    document.getElementById("dataInput").value = content.data;
    document.getElementById("headerTitle").value = content.headerTitle;
    document.getElementById("headerDesc").value = content.headerDesc;
    document.getElementById("footerText").value = content.footerText;
    logoData = content.logoData;
    tableOrientation = content.orientation || "horizontal";
    document.getElementById("logoPreview").src = logoData;
    generateTable();
  };
  reader.readAsText(file);
    
    showSuccessToast("تم تحميل الجدول بنجاح!");
  } catch (error) {
     showErrorToast("هناك خطاء: " + error.message);
  }
}

async function downloadPDF() {
  try {
    
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const element = document.getElementById("printContent");

  if (!element) {
    showErrorToast("لا يوجد جدول لتحميله. يرجى إنشاء الجدول أولاً.");
    return;
  }
  await html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save("tableau.pdf");
  });

  showSuccessToast("تم حفظ الجدول PDF بنجاح!");
    } catch (error) {
     showErrorToast("هناك خطاء: " + error.message);
  }
}

function downloadPNG() {
  try {
    
  const element = document.getElementById("printContent");
  // Check if element exists
    if (!element) {
      showErrorToast("لا يوجد جدول لتحميله. يرجى إنشاء الجدول أولاً.");
      return;
    }
  html2canvas(element).then((canvas) => {
    const link = document.createElement("a");
    link.download = "table.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
    showSuccessToast("تم حفظ الجدول PNG بنجاح!");
   } catch (error) {
     showErrorToast("هناك خطاء: " + error.message);
  }
}
function downloadWord() {
  try {
    
  
  const content = document.getElementById("printContent").innerHTML;
 
  const blob = new Blob(
    [
      '<html><head><meta charset="UTF-8"></head><body>' +
        content +
        "</body></html>",
    ],
    {
      type: "application/msword",
    }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tableau.doc";
  link.click();

  showSuccessToast("تم حفظ الجدول WORD بنجاح!");
    } catch (error) {
     showErrorToast("هناك خطاء: " + error.message);
  }
}

function changeTheme(theme) {
  const root = document.documentElement;
  const themes = {
    rose: {
      "--main-color": "#ec407a",
      "--main-dark": "#d81b60",
      "--background-color": "#fff0f5",
      "--table-header": "#f06292",
      "--table-row-alt": "#ffe3ef",
      "--border-color": "#f8bbd0",
    },
    blue: {
      "--main-color": "#42a5f5",
      "--main-dark": "#1e88e5",
      "--background-color": "#e3f2fd",
      "--table-header": "#64b5f6",
      "--table-row-alt": "#bbdefb",
      "--border-color": "#90caf9",
    },
    purple: {
      "--main-color": "#ab47bc",
      "--main-dark": "#8e24aa",
      "--background-color": "#f3e5f5",
      "--table-header": "#ce93d8",
      "--table-row-alt": "#e1bee7",
      "--border-color": "#ba68c8",
    },
    green: {
      "--main-color": "#66bb6a",
      "--main-dark": "#43a047",
      "--background-color": "#e8f5e9",
      "--table-header": "#81c784",
      "--table-row-alt": "#c8e6c9",
      "--border-color": "#a5d6a7",
    },
  };
  const selected = themes[theme];
  for (let key in selected) {
    root.style.setProperty(key, selected[key]);
  }
}

// Modal functionality
function showAboutModal() {
  const modal = document.getElementById('aboutModal');
  modal.style.display = 'block';
}

// Initialize modal functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Close modal when clicking the X button
  const closeButton = document.querySelector('.close');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      const modal = document.getElementById('aboutModal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Close modal when clicking outside of it
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('aboutModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('aboutModal');
      if (modal && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    }
  });
});