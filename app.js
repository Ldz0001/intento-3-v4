
let venueData = [], packageData = [], addonData = [];

document.getElementById('excelInput').addEventListener('change', handleFile, false);
document.getElementById('loadDefault').addEventListener('click', () => loadExcel('./data/database.xlsx'));

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    processWorkbook(workbook);
  };
  reader.readAsArrayBuffer(file);
}

function loadExcel(url) {
  fetch(url).then(res => res.arrayBuffer()).then(data => {
    const workbook = XLSX.read(data, {type: 'array'});
    processWorkbook(workbook);
  }).catch(() => alert('Failed to load default Excel file.'));
}

function processWorkbook(workbook) {
  venueData = XLSX.utils.sheet_to_json(workbook.Sheets['VENUES']);
  packageData = XLSX.utils.sheet_to_json(workbook.Sheets['PACKAGES']);
  addonData = XLSX.utils.sheet_to_json(workbook.Sheets['ADDONS']);
  populateVenues();
  populateAddons();
  document.getElementById('venueSelect').addEventListener('change', populatePackages);
  document.getElementById('guestCount').addEventListener('input', updateQuote);
  document.getElementById('packageSelect').addEventListener('change', updateQuote);
  document.getElementById('addonSelect').addEventListener('change', updateQuote);
}

function populateVenues() {
  const select = document.getElementById('venueSelect');
  select.innerHTML = '<option value="">-- Select Venue --</option>';
  venueData.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.VENUE;
    opt.textContent = v.VENUE;
    select.appendChild(opt);
  });
}

function populatePackages() {
  const venue = document.getElementById('venueSelect').value;
  const select = document.getElementById('packageSelect');
  select.innerHTML = '<option value="">-- Select Package --</option>';
  const filtered = packageData.filter(p => p.VENUE === venue);
  filtered.forEach(pkg => {
    const opt = document.createElement('option');
    opt.value = pkg.PACKAGE;
    opt.textContent = `${pkg.PACKAGE} (${pkg.GUESTS} guests - $${pkg.PRICE})`;
    select.appendChild(opt);
  });
  updateQuote();
}

function populateAddons() {
  const select = document.getElementById('addonSelect');
  select.innerHTML = '';
  addonData.forEach(add => {
    const opt = document.createElement('option');
    opt.value = add.ADDON;
    opt.textContent = `${add.ADDON} ($${add.PRICE})`;
    select.appendChild(opt);
  });
}

function updateQuote() {
  const guests = parseInt(document.getElementById('guestCount').value) || 0;
  const packageName = document.getElementById('packageSelect').value;
  const packageObj = packageData.find(p => p.PACKAGE === packageName);
  const addonSelect = document.getElementById('addonSelect');
  const selectedAddons = Array.from(addonSelect.selectedOptions).map(opt => opt.value);

  const tbody = document.querySelector('#quoteTable tbody');
  tbody.innerHTML = '';

  let subtotal = 0;

  if (packageObj) {
    const pkgPrice = parseFloat(packageObj.PRICE) || 0;
    const row = buildRow(packageObj.PACKAGE, `${packageObj.GUESTS} guests`, 1, pkgPrice);
    subtotal += pkgPrice;
    tbody.appendChild(row);
  }

  selectedAddons.forEach(addonName => {
    const add = addonData.find(a => a.ADDON === addonName);
    if (add) {
      const unit = parseFloat(add.PRICE) || 0;
      const qty = 1;
      const row = buildRow(add.ADDON, add.DETAILS || '', qty, unit);
      subtotal += qty * unit;
      tbody.appendChild(row);
    }
  });

  const totalRow = document.createElement('tr');
  totalRow.innerHTML = `<td colspan="4"><strong>Total</strong></td><td><strong>$${subtotal.toFixed(2)}</strong></td>`;
  tbody.appendChild(totalRow);
}

function buildRow(name, details, qty, price) {
  const tr = document.createElement('tr');
  const total = qty * price;
  tr.innerHTML = `
    <td>${name}</td>
    <td>${details}</td>
    <td>${qty}</td>
    <td>$${price.toFixed(2)}</td>
    <td>$${total.toFixed(2)}</td>
  `;
  return tr;
}

// Export functions
document.getElementById('exportPdf').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.autoTable({ html: '#quoteTable' });
  doc.save('quotation.pdf');
});

document.getElementById('exportDocx').addEventListener('click', () => {
  const table = document.querySelector('#quoteTable');
  const doc = new window.docx.Document();
  const rows = Array.from(table.rows).map(tr => new docx.TableRow({
    children: Array.from(tr.cells).map(cell => new docx.TableCell({
      children: [new docx.Paragraph(cell.textContent)],
    }))
  }));
  doc.addSection({ children: [new docx.Table({ rows })] });
  docx.Packer.toBlob(doc).then(blob => saveAs(blob, 'quotation.docx'));
});

document.getElementById('exportXlsx').addEventListener('click', () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(document.getElementById('quoteTable'));
  XLSX.utils.book_append_sheet(wb, ws, 'Quotation');
  XLSX.writeFile(wb, 'quotation.xlsx');
});
