(() => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const DEFAULT_DATA = {
    venues: [
      { VENUE: 'Aurora Ballroom', LOCATION: 'Downtown Arts District', CAPACITY: 250 },
      { VENUE: 'Harborview Terrace', LOCATION: 'Seaside Promenade', CAPACITY: 180 },
      { VENUE: 'Garden Pavilion', LOCATION: 'Botanical Park', CAPACITY: 120 },
      { VENUE: 'Skyline Loft', LOCATION: 'Financial Quarter', CAPACITY: 140 },
    ],
    packages: [
      {
        VENUE: 'Aurora Ballroom',
        PACKAGE: 'Signature Evening',
        GUESTS: 150,
        PRICE: 18500,
        DESCRIPTION: 'Five-course dinner, premium open bar, custom lighting design.',
      },
      {
        VENUE: 'Aurora Ballroom',
        PACKAGE: 'Cocktail Soirée',
        GUESTS: 120,
        PRICE: 14500,
        DESCRIPTION: 'Two-hour cocktail reception with twelve chef stations.',
      },
      {
        VENUE: 'Harborview Terrace',
        PACKAGE: 'Sunset Celebration',
        GUESTS: 100,
        PRICE: 16800,
        DESCRIPTION: 'Seasonal buffet, patio lounge furniture, and fire pit service.',
      },
      {
        VENUE: 'Garden Pavilion',
        PACKAGE: 'Garden Gala',
        GUESTS: 90,
        PRICE: 15200,
        DESCRIPTION: 'Farm-to-table tasting menu, floral décor, and string quartet.',
      },
      {
        VENUE: 'Skyline Loft',
        PACKAGE: 'City Lights Experience',
        GUESTS: 110,
        PRICE: 17450,
        DESCRIPTION: 'Rooftop ceremony, urban tapas stations, and skyline photo lounge.',
      },
    ],
    addons: [
      {
        ADDON: 'Live Jazz Trio',
        PRICE: 1200,
        DETAILS: 'Three-hour performance with curated set breaks.',
      },
      {
        ADDON: 'Custom Lighting Design',
        PRICE: 950,
        DETAILS: 'Uplighting, gobo projection, and dance floor wash.',
      },
      {
        ADDON: 'Photo Booth Experience',
        PRICE: 750,
        DETAILS: 'Unlimited prints, on-site attendant, digital gallery delivery.',
      },
      {
        ADDON: 'Late-Night Snack Bar',
        PRICE: 9,
        QTY: 120,
        DETAILS: 'Per-guest pricing with gourmet sliders and fries (120 servings).',
      },
      {
        ADDON: 'Luxury Transportation',
        PRICE: 550,
        DETAILS: 'Executive sedan transfers for VIP guests (up to 3 hours).',
      },
    ],
  };

  const state = {
    refs: null,
  };

  let venueData = [];
  let packageData = [];
  let addonData = [];

  document.addEventListener('DOMContentLoaded', () => {
    const refs = {
      excelInput: document.getElementById('excelInput'),
      loadDefault: document.getElementById('loadDefault'),
      venueSelect: document.getElementById('venueSelect'),
      guestInput: document.getElementById('guestCount'),
      packageSelect: document.getElementById('packageSelect'),
      addonSelect: document.getElementById('addonSelect'),
      tableBody: document.querySelector('#quoteTable tbody'),
      status: document.getElementById('quoteStatus'),
      totalValue: document.getElementById('quoteTotalValue'),
      guestValue: document.getElementById('quoteGuestValue'),
      packageValue: document.getElementById('quotePackageValue'),
      exportPdf: document.getElementById('exportPdf'),
      exportDocx: document.getElementById('exportDocx'),
      exportXlsx: document.getElementById('exportXlsx'),
    };

    if (!refs.venueSelect || !refs.tableBody) {
      return;
    }

    state.refs = refs;

    refs.excelInput?.addEventListener('change', handleFile);
    refs.loadDefault?.addEventListener('click', () => {
      loadDefaultData();
      announceStatus('Sample data loaded. You can continue customising the quote.', 'success');
    });

    refs.venueSelect.addEventListener('change', () => {
      populatePackages();
      updateQuote();
    });
    refs.packageSelect.addEventListener('change', updateQuote);
    refs.addonSelect.addEventListener('change', updateQuote);
    refs.guestInput.addEventListener('input', updateQuote);

    refs.exportPdf?.addEventListener('click', exportPdf);
    refs.exportDocx?.addEventListener('click', exportDocx);
    refs.exportXlsx?.addEventListener('click', exportXlsx);

    loadDefaultData();
    announceStatus('Sample data loaded. Choose a venue to get started.', 'success');
  });

  function loadDefaultData() {
    venueData = DEFAULT_DATA.venues.map(clone);
    packageData = DEFAULT_DATA.packages.map(clone);
    addonData = DEFAULT_DATA.addons.map(clone);
    refreshSelectors();
    updateQuote();
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    announceStatus(`Loading ${file.name}…`);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(buffer, { type: 'array' });
        loadFromWorkbook(workbook);
        announceStatus(`Imported ${file.name}. Select a venue to review the pricing.`, 'success');
      } catch (error) {
        console.error(error);
        announceStatus('We could not read that workbook. Ensure it includes VENUES, PACKAGES, and ADDONS sheets.', 'error');
      } finally {
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      announceStatus('We could not read the selected file. Please try a different .xlsx file.', 'error');
      event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  }

  function loadFromWorkbook(workbook) {
    const venuesSheet = workbook.Sheets['VENUES'];
    const packagesSheet = workbook.Sheets['PACKAGES'];
    if (!venuesSheet || !packagesSheet) {
      throw new Error('Missing VENUES or PACKAGES sheet');
    }
    const addonsSheet = workbook.Sheets['ADDONS'];

    venueData = XLSX.utils.sheet_to_json(venuesSheet);
    packageData = XLSX.utils.sheet_to_json(packagesSheet);
    addonData = addonsSheet ? XLSX.utils.sheet_to_json(addonsSheet) : [];

    refreshSelectors();
    updateQuote();
  }

  function refreshSelectors() {
    if (!state.refs) return;
    const { venueSelect, packageSelect, addonSelect } = state.refs;
    const previousVenue = venueSelect.value;
    const previousPackage = packageSelect.value;
    const previousAddons = new Set(Array.from(addonSelect?.selectedOptions || []).map((opt) => opt.value));

    populateVenues(previousVenue);
    populatePackages(previousPackage);
    populateAddons(previousAddons);
  }

  function populateVenues(previousValue = '') {
    const { venueSelect } = state.refs;
    venueSelect.innerHTML = '';

    if (!venueData.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No venues available';
      option.disabled = true;
      option.selected = true;
      venueSelect.appendChild(option);
      return;
    }

    venueData
      .filter((venue) => venue && venue.VENUE)
      .forEach((venue, index) => {
        const option = document.createElement('option');
        option.value = String(venue.VENUE);
        const parts = [venue.VENUE];
        if (venue.LOCATION) parts.push(`• ${venue.LOCATION}`);
        if (venue.CAPACITY) parts.push(`— up to ${Number(venue.CAPACITY).toLocaleString()} guests`);
        option.textContent = parts.join(' ');
        if (index === 0 && !previousValue) {
          option.selected = true;
        }
        venueSelect.appendChild(option);
      });

    if (previousValue && venueData.some((venue) => String(venue.VENUE) === previousValue)) {
      venueSelect.value = previousValue;
    }
  }

  function populatePackages(previousValue = '') {
    const { venueSelect, packageSelect } = state.refs;
    const selectedVenue = venueSelect.value;
    packageSelect.innerHTML = '';

    const matching = packageData.filter((pkg) => !selectedVenue || String(pkg.VENUE) === selectedVenue);

    if (!matching.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = selectedVenue ? 'No packages available for this venue' : 'No packages available';
      option.disabled = true;
      packageSelect.appendChild(option);
      return;
    }

    matching.forEach((pkg) => {
      if (!pkg?.PACKAGE) return;
      const option = document.createElement('option');
      option.value = String(pkg.PACKAGE);
      const guestCount = parseInt(pkg.GUESTS, 10);
      const guestLabel = Number.isFinite(guestCount) && guestCount > 0 ? `${guestCount.toLocaleString()} guests` : 'Flexible';
      option.textContent = `${pkg.PACKAGE} — ${guestLabel} — ${formatCurrency(asNumber(pkg.PRICE))}`;
      packageSelect.appendChild(option);
    });

    if (previousValue && matching.some((pkg) => String(pkg.PACKAGE) === previousValue)) {
      packageSelect.value = previousValue;
    } else if (matching.length) {
      const [first] = matching;
      packageSelect.value = String(first.PACKAGE);
      const guestCount = parseInt(first.GUESTS, 10);
      if (
        Number.isFinite(guestCount) &&
        guestCount > 0 &&
        state.refs?.guestInput &&
        (!state.refs.guestInput.value || state.refs.guestInput.value === '0')
      ) {
        state.refs.guestInput.value = guestCount;
      }
    }
  }

  function populateAddons(previousValues = new Set()) {
    const { addonSelect } = state.refs;
    addonSelect.innerHTML = '';

    if (!addonData.length) {
      const option = document.createElement('option');
      option.textContent = 'No add-ons available in this dataset';
      option.disabled = true;
      addonSelect.appendChild(option);
      return;
    }

    addonData
      .filter((addon) => addon && addon.ADDON)
      .forEach((addon) => {
        const option = document.createElement('option');
        option.value = String(addon.ADDON);
        option.textContent = `${addon.ADDON} — ${formatCurrency(asNumber(addon.PRICE))}`;
        option.selected = previousValues.has(option.value);
        addonSelect.appendChild(option);
      });
  }

  function updateQuote() {
    if (!state.refs) return;
    const { guestInput, packageSelect, addonSelect, tableBody, totalValue, guestValue, packageValue } = state.refs;

    const guests = Math.max(0, parseInt(guestInput.value, 10) || 0);
    guestInput.value = guests;
    guestValue.textContent = guests.toLocaleString();

    const packageName = packageSelect.value;
    const packageObj = packageData.find((pkg) => String(pkg.PACKAGE) === packageName);
    packageValue.textContent = packageObj ? packageObj.PACKAGE : '—';

    const selectedAddons = Array.from(addonSelect?.selectedOptions || []).map((opt) => opt.value);

    tableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();
    let subtotal = 0;
    let rowCount = 0;

    if (packageObj) {
      const pkgPrice = asNumber(packageObj.PRICE);
      const details = buildPackageDetails(packageObj);
      fragment.appendChild(buildRow(packageObj.PACKAGE, details, 1, pkgPrice));
      subtotal += pkgPrice;
      rowCount++;
    }

    selectedAddons.forEach((addonName) => {
      const addon = addonData.find((item) => String(item.ADDON) === addonName);
      if (!addon) return;
      const qty = Math.max(1, asNumber(addon.QTY) || 1);
      const unit = asNumber(addon.PRICE);
      const details = addon.DETAILS || addon.DESCRIPTION || '';
      fragment.appendChild(buildRow(addon.ADDON, details, qty, unit));
      subtotal += qty * unit;
      rowCount++;
    });

    if (!rowCount) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-row';
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.textContent = 'Select a venue, package, or add-ons to populate the quote.';
      emptyRow.appendChild(cell);
      tableBody.appendChild(emptyRow);
    } else {
      tableBody.appendChild(fragment);
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      const totalLabel = document.createElement('td');
      totalLabel.colSpan = 4;
      totalLabel.textContent = 'Total';
      const totalValueCell = document.createElement('td');
      totalValueCell.textContent = formatCurrency(subtotal);
      totalRow.append(totalLabel, totalValueCell);
      tableBody.appendChild(totalRow);
    }

    totalValue.textContent = formatCurrency(subtotal);
  }

  function exportPdf() {
    const table = document.getElementById('quoteTable');
    const pdfLib = window.jspdf;
    if (!pdfLib || !table) {
      announceStatus('PDF export is unavailable in this environment.', 'error');
      return;
    }
    const doc = new pdfLib.jsPDF();
    doc.text('Event Quote', 14, 18);
    doc.autoTable({ html: '#quoteTable', startY: 24 });
    doc.save('quotation.pdf');
  }

  function exportDocx() {
    const table = document.getElementById('quoteTable');
    const docx = window.docx;
    if (!docx?.Document || !table) {
      announceStatus('DOCX export is unavailable in this environment.', 'error');
      return;
    }
    const rows = Array.from(table.rows).map((tr) => new docx.TableRow({
      children: Array.from(tr.cells).map((cell) => new docx.TableCell({
        children: [new docx.Paragraph(cell.textContent)],
      })),
    }));
    const document = new docx.Document({
      sections: [
        {
          properties: {},
          children: [
            new docx.Paragraph({ text: 'Event Quote', heading: docx.HeadingLevel.HEADING_1 }),
            new docx.Table({ rows }),
          ],
        },
      ],
    });
    docx.Packer.toBlob(document).then((blob) => {
      saveAs(blob, 'quotation.docx');
    });
  }

  function exportXlsx() {
    const table = document.getElementById('quoteTable');
    if (!table) {
      return;
    }
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Quotation');
    XLSX.writeFile(workbook, 'quotation.xlsx');
  }

  function buildPackageDetails(pkg) {
    const details = [];
    const guests = parseInt(pkg.GUESTS, 10);
    if (Number.isFinite(guests) && guests > 0) {
      details.push(`${guests.toLocaleString()} guests included`);
    }
    if (pkg.DURATION) {
      details.push(String(pkg.DURATION));
    }
    if (pkg.DESCRIPTION) {
      details.push(String(pkg.DESCRIPTION));
    } else if (pkg.DETAILS) {
      details.push(String(pkg.DETAILS));
    }
    return details.join(' • ');
  }

  function buildRow(name, details, qty, price) {
    const tr = document.createElement('tr');
    const values = [
      name || '—',
      details || '—',
      Number.isFinite(qty) ? qty.toLocaleString() : '1',
      formatCurrency(price),
      formatCurrency((Number.isFinite(qty) ? qty : 1) * price),
    ];
    values.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    return tr;
  }

  function formatCurrency(value) {
    return currencyFormatter.format(asNumber(value));
  }

  function announceStatus(message, tone) {
    const status = state.refs?.status;
    if (!status) return;
    status.textContent = message || '';
    status.classList.remove('is-error', 'is-success');
    if (!message) return;
    if (tone === 'error') {
      status.classList.add('is-error');
    } else if (tone === 'success') {
      status.classList.add('is-success');
    }
  }

  function asNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function clone(item) {
    return { ...item };
  }
})();
