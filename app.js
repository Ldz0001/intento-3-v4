(() => {
  const BASIS = {
    FLAT: 'flat',
    PER_GUEST: 'perGuest',
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const DEFAULT_DATA = {
    venues: [
      {
        id: 'VE-AURORA',
        name: 'Aurora Ballroom',
        location: 'Downtown Arts District',
        capacity: 250,
        group: 'G1',
      },
      {
        id: 'VE-HARBOR',
        name: 'Harborview Terrace',
        location: 'Seaside Promenade',
        capacity: 180,
        group: 'G2',
      },
      {
        id: 'VE-GARDEN',
        name: 'Garden Pavilion',
        location: 'Botanical Park',
        capacity: 120,
        group: 'G3',
      },
      {
        id: 'VE-SKYLINE',
        name: 'Skyline Loft',
        location: 'Financial Quarter',
        capacity: 140,
        group: 'G4',
      },
    ],
    packages: [
      {
        id: 'PKG-AURORA-EVE',
        venueId: 'VE-AURORA',
        group: 'G1',
        name: 'Signature Evening',
        description: 'Five-course dinner, premium open bar, custom lighting design.',
        duration: '6-hour rental',
        defaultGuests: 150,
        pricing: [
          { minGuests: 80, maxGuests: 120, price: 16500, basis: BASIS.FLAT, label: 'Up to 120 guests' },
          { minGuests: 121, maxGuests: 180, price: 18500, basis: BASIS.FLAT, label: 'Up to 180 guests' },
          { minGuests: 181, maxGuests: 260, price: 21400, basis: BASIS.FLAT, label: 'Up to 260 guests' },
        ],
      },
      {
        id: 'PKG-AURORA-COCKTAIL',
        venueId: 'VE-AURORA',
        group: 'G1',
        name: 'Cocktail Soirée',
        description: 'Two-hour cocktail reception with chef stations and lounge seating.',
        defaultGuests: 120,
        pricing: [
          { minGuests: 60, maxGuests: 120, price: 14500, basis: BASIS.FLAT, label: 'Up to 120 guests' },
          { minGuests: 121, maxGuests: 200, price: 16800, basis: BASIS.FLAT, label: 'Up to 200 guests' },
        ],
      },
      {
        id: 'PKG-HARBOR-SUNSET',
        venueId: 'VE-HARBOR',
        group: 'G2',
        name: 'Sunset Celebration',
        description: 'Seasonal buffet, patio lounge furniture, and fire pit service.',
        defaultGuests: 100,
        pricing: [
          { minGuests: 60, maxGuests: 100, price: 15200, basis: BASIS.FLAT, label: 'Up to 100 guests' },
          { minGuests: 101, maxGuests: 160, price: 17450, basis: BASIS.FLAT, label: 'Up to 160 guests' },
        ],
      },
      {
        id: 'PKG-GARDEN-GALA',
        venueId: 'VE-GARDEN',
        group: 'G3',
        name: 'Garden Gala',
        description: 'Farm-to-table tasting menu, floral décor, and string quartet.',
        defaultGuests: 90,
        pricing: [
          { minGuests: 40, maxGuests: 90, price: 13200, basis: BASIS.FLAT, label: 'Up to 90 guests' },
          { minGuests: 91, maxGuests: 140, price: 15400, basis: BASIS.FLAT, label: 'Up to 140 guests' },
        ],
      },
      {
        id: 'PKG-SKYLINE-LIGHTS',
        venueId: 'VE-SKYLINE',
        group: 'G4',
        name: 'City Lights Experience',
        description: 'Rooftop ceremony, tapas stations, and skyline photo lounge.',
        defaultGuests: 110,
        pricing: [
          { minGuests: 60, maxGuests: 110, price: 16200, basis: BASIS.FLAT, label: 'Up to 110 guests' },
          { minGuests: 111, maxGuests: 180, price: 18450, basis: BASIS.FLAT, label: 'Up to 180 guests' },
        ],
      },
    ],
    addons: [
      {
        id: 'AD-LIVE-JAZZ',
        name: 'Live Jazz Trio',
        category: 'Entertainment',
        description: 'Three-hour performance with curated set breaks.',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 1200, basis: BASIS.FLAT }],
      },
      {
        id: 'AD-CUSTOM-LIGHTING',
        name: 'Custom Lighting Design',
        category: 'Production',
        description: 'Uplighting, gobo projection, and dance floor wash.',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 950, basis: BASIS.FLAT }],
      },
      {
        id: 'AD-PHOTO-BOOTH',
        name: 'Photo Booth Experience',
        category: 'Entertainment',
        description: 'Unlimited prints, on-site attendant, digital gallery delivery.',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 750, basis: BASIS.FLAT }],
      },
      {
        id: 'AD-LATE-SNACK',
        name: 'Late-Night Snack Bar',
        category: 'Culinary',
        description: 'Per-guest pricing with gourmet sliders and fries.',
        chargeType: BASIS.PER_GUEST,
        defaultQty: 0,
        pricing: [
          { minGuests: 0, maxGuests: 150, price: 9, basis: BASIS.PER_GUEST, label: 'Up to 150 guests' },
          { minGuests: 151, maxGuests: 260, price: 8.5, basis: BASIS.PER_GUEST, label: '151+ guests' },
        ],
      },
      {
        id: 'AD-LUX-TRANSPORT',
        name: 'Luxury Transportation',
        category: 'Logistics',
        description: 'Executive sedan transfers for VIP guests (up to 3 hours).',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 550, basis: BASIS.FLAT }],
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
      populatePackages(refs.packageSelect.value);
      updateQuote();
    });

    refs.packageSelect.addEventListener('change', () => {
      const pkg = packageData.find((item) => item.id === refs.packageSelect.value);
      if (pkg && (!refs.guestInput.value || refs.guestInput.value === '0') && pkg.defaultGuests) {
        refs.guestInput.value = pkg.defaultGuests;
      }
      updateQuote();
    });

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
        announceStatus('We could not read that workbook. Ensure it includes Venues, Packages, Pricing, and AddOns data.', 'error');
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
    const venuesSheet = findSheet(workbook, ['Venues', 'VENUES', 'venues']);
    const packagesSheet = findSheet(workbook, ['Packages', 'PACKAGES', 'packages']);
    const pricingSheet = findSheet(workbook, ['Pricing', 'PRICING', 'PackagePricing']);
    const addonsSheet = findSheet(workbook, ['AddOns', 'ADDONS', 'Add-Ons', 'Add ons']);
    const addonPricingSheet = findSheet(workbook, ['AddOnPricing', 'AddonPricing', 'Add-on Pricing']);
    const quoteAddonSheet = findSheet(workbook, ['Quote_AddOns', 'Quote_Addons', 'Quote AddOns']);

    if (!packagesSheet || !pricingSheet) {
      throw new Error('Missing Packages or Pricing sheet');
    }

    const venues = venuesSheet ? parseWorkbookVenues(venuesSheet) : [];
    const pricingMap = parsePricingSheet(pricingSheet);
    const addOnPricingMap = addonPricingSheet ? parsePricingSheet(addonPricingSheet, { defaultBasis: BASIS.PER_GUEST }) : new Map();

    const packages = parseWorkbookPackages(packagesSheet, pricingMap, venues);
    const addonsFromPrimary = addonsSheet ? parseWorkbookAddons(addonsSheet, addOnPricingMap) : [];
    const addonsFallback = !addonsFromPrimary.length && quoteAddonSheet
      ? parseWorkbookAddons(quoteAddonSheet, addOnPricingMap)
      : [];

    venueData = venues;
    packageData = packages;
    addonData = addonsFromPrimary.length ? addonsFromPrimary : addonsFallback;

    refreshSelectors();
    updateQuote();
  }

  function parseWorkbookVenues(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    return rows
      .map((row) => {
        const id = pickFirst(row, ['VenueID', 'Venue Id', 'Venue_Id', 'ID', 'Code']);
        const name = pickFirst(row, ['Venue', 'Name', 'VenueName', 'Title']);
        const location = pickFirst(row, ['Location', 'City', 'Market', 'Region']);
        const capacity = toNumber(pickFirst(row, ['Capacity', 'MaxCapacity', 'Max Guests', 'Guests', 'Cap']));
        const group = pickFirst(row, ['Group', 'Grouping', 'VenueGroup', 'Cluster']);
        const markupRaw = pickFirst(row, ['Markup', 'Margin', 'Markup %', 'MarkupPct']);
        const markup = typeof markupRaw === 'number' ? normalisePercentage(markupRaw) : normalisePercentage(toNumber(markupRaw));

        if (!id && !name) {
          return null;
        }

        return {
          id: String(id || name).trim(),
          name: String(name || id).trim(),
          location: location ? String(location).trim() : '',
          capacity: Number.isFinite(capacity) ? capacity : null,
          group: group ? String(group).trim() : '',
          markup,
          source: row,
        };
      })
      .filter(Boolean);
  }

  function parseWorkbookPackages(sheet, pricingMap, venues) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const packages = rows
      .map((row, index) => {
        const id = pickFirst(row, ['PackageID', 'Package Id', 'Package', 'Code', 'ID']) || `PKG-${index + 1}`;
        const name = pickFirst(row, ['Name', 'PackageName', 'Package', 'Title']) || id;
        const description = pickFirst(row, ['Description', 'Details', 'Summary']);
        const duration = pickFirst(row, ['Duration', 'Hours', 'Timing']);
        const group = pickFirst(row, ['Group', 'Grouping', 'VenueGroup', 'Cluster']);
        const venueId = pickFirst(row, ['VenueID', 'Venue Id', 'Venue']);
        const defaultGuests = toNumber(
          pickFirst(row, [
            'Guests',
            'GuestCount',
            'IncludedGuests',
            'Included Guests',
            'Guest Default',
            'Default Guests',
            'MinGuests',
            'GuestsMin',
            'MaxGuests',
            'GuestsMax',
          ])
        );
        const chargeType = parseChargeType(pickFirst(row, ['ChargeType', 'Billing', 'Per', 'Basis']), row.PerGuest);
        const basePrice = toNumber(
          pickFirst(row, [
            'Price',
            'BasePrice',
            'Rate',
            'Amount',
            'UnitPrice',
            'Unit Price',
            'PerGuestPrice',
            'Per Guest Price',
            'PricePerGuest',
            'PerGuest',
          ])
        );

        const pkg = {
          id: String(id).trim(),
          name: String(name).trim(),
          description: description ? String(description).trim() : '',
          duration: duration ? String(duration).trim() : '',
          group: group ? String(group).trim() : '',
          venueId: venueId ? String(venueId).trim() : '',
          defaultGuests: Number.isFinite(defaultGuests) ? defaultGuests : null,
          chargeType,
          basePrice: Number.isFinite(basePrice) ? basePrice : null,
          pricing: [],
          source: row,
        };

        const venue = pkg.venueId
          ? venues.find((item) => normaliseKey(item.id) === normaliseKey(pkg.venueId) || normaliseKey(item.name) === normaliseKey(pkg.venueId))
          : null;
        if (!pkg.group && venue?.group) {
          pkg.group = venue.group;
        }

        const matchKeys = new Set(
          [
            pkg.id,
            pkg.name,
            pkg.group,
          pkg.venueId,
          pkg.source?.Slug,
          pkg.source?.PackageID,
          pkg.source?.['Package Id'],
          pkg.source?.Code,
          pkg.source?.SKU,
          pkg.source?.VenueID,
          pkg.source?.['Venue Id'],
          pkg.source?.Venue,
          pkg.source?.['Venue Name'],
          pkg.source?.VenueCode,
          pkg.source?.['Venue Code'],
          pkg.source?.['Display Name'],
          pkg.source?.['Package Name'],
          pkg.source?.['Package'],
          pkg.source?.['Quote Option'],
          pkg.source?.['QuoteOption'],
          pkg.venueId && pkg.id ? `${pkg.venueId}:${pkg.id}` : null,
          pkg.source?.VenueID && pkg.id ? `${pkg.source.VenueID}:${pkg.id}` : null,
          pkg.source?.['Venue Id'] && pkg.id ? `${pkg.source['Venue Id']}:${pkg.id}` : null,
          pkg.source?.Venue && pkg.source?.Package ? `${pkg.source.Venue}:${pkg.source.Package}` : null,
          pkg.group && pkg.source?.Package ? `${pkg.group}:${pkg.source.Package}` : null,
          pkg.group && pkg.name ? `${pkg.group}:${pkg.name}` : null,
        ]
            .filter(Boolean)
            .map((value) => normaliseKey(value))
        );

        const pricingEntry = findPricingForKeys(pricingMap, matchKeys);
        if (pricingEntry) {
          pkg.pricing = pricingEntry.tiers.map(clone);
          if (!pkg.defaultGuests && pricingEntry.defaultGuests) {
            pkg.defaultGuests = pricingEntry.defaultGuests;
          }
          if (!pkg.chargeType && pricingEntry.defaultBasis) {
            pkg.chargeType = pricingEntry.defaultBasis;
          }
          pricingEntry.assigned = true;
        }

        if (!pkg.pricing.length && Number.isFinite(pkg.basePrice)) {
          pkg.pricing = [
            {
              minGuests: 0,
              maxGuests: Infinity,
              price: pkg.basePrice,
              basis: pkg.chargeType || BASIS.FLAT,
            },
          ];
        }

        return pkg;
      })
      .filter((pkg) => pkg);

    pricingMap.forEach((entry, key) => {
      if (entry.primaryKey && key !== entry.primaryKey) {
        return;
      }
      if (entry.assigned) {
        return;
      }
      const alreadyMatched = packages.some((pkg) => pkg.pricing?.length && matchesKey(pkg, key));
      if (alreadyMatched) {
        return;
      }
      packages.push({
        id: entry.label || `PKG-${packages.length + 1}`,
        name: entry.label || `Package ${packages.length + 1}`,
        description: '',
        duration: '',
        group: '',
        venueId: '',
        defaultGuests: entry.defaultGuests || null,
        chargeType: entry.defaultBasis || BASIS.FLAT,
        basePrice: null,
        pricing: entry.tiers.map(clone),
        source: { generatedFromPricing: true },
      });
    });

    return packages;
  }

  function parseWorkbookAddons(sheet, pricingMap) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    return rows
      .map((row, index) => {
        const id = pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'ID', 'Code', 'AddOn']) || `ADDON-${index + 1}`;
        const name = pickFirst(row, ['Name', 'AddOn', 'Addon', 'Title']) || id;
        const category = pickFirst(row, ['Category', 'Type', 'Group', 'Segment']);
        const description = pickFirst(row, ['Description', 'Details', 'Summary']);
        const chargeType = parseChargeType(pickFirst(row, ['ChargeType', 'Basis', 'Billing', 'Per']), row.PerGuest);
        const basePrice = toNumber(
          pickFirst(row, [
            'Price',
            'BasePrice',
            'Rate',
            'Amount',
            'UnitPrice',
            'Unit Price',
            'PerGuestPrice',
            'Per Guest Price',
            'PricePerGuest',
            'PerGuest',
          ])
        );
        const defaultQty = toNumber(pickFirst(row, ['Qty', 'Quantity', 'DefaultQty', 'Default Quantity', 'Qty Default']));

        const addon = {
          id: String(id).trim(),
          name: String(name).trim(),
          category: category ? String(category).trim() : '',
          description: description ? String(description).trim() : '',
          chargeType,
          basePrice: Number.isFinite(basePrice) ? basePrice : null,
          defaultQty: Number.isFinite(defaultQty) ? defaultQty : 0,
          pricing: [],
          source: row,
        };

        const matchKeys = new Set(
          [
            addon.id,
            addon.name,
            addon.category,
            addon.source?.Code,
            addon.source?.SKU,
            addon.source?.Slug,
            addon.source?.['AddOnID'],
            addon.source?.['AddOn Id'],
            addon.source?.['Quote Option'],
            addon.source?.QuoteOption,
          ]
            .filter(Boolean)
            .map((value) => normaliseKey(value))
        );

        const pricingEntry = findPricingForKeys(pricingMap, matchKeys);
        if (pricingEntry) {
          addon.pricing = pricingEntry.tiers.map(clone);
          if (!addon.chargeType && pricingEntry.defaultBasis) {
            addon.chargeType = pricingEntry.defaultBasis;
          }
        }

        if (!addon.pricing.length && Number.isFinite(addon.basePrice)) {
          addon.pricing = [
            {
              minGuests: 0,
              maxGuests: Infinity,
              price: addon.basePrice,
              basis: addon.chargeType || BASIS.FLAT,
              quantity: Number.isFinite(addon.defaultQty) && addon.defaultQty > 0 ? addon.defaultQty : undefined,
            },
          ];
        }

        return addon;
      })
      .filter(Boolean);
  }

  function parsePricingSheet(sheet, options = {}) {
    const { defaultBasis = BASIS.FLAT } = options;
    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false });
    const matrixEntries = extractPricingFromMatrix(matrix, defaultBasis);
    if (matrixEntries.size) {
      return matrixEntries;
    }
    return extractPricingFromRows(XLSX.utils.sheet_to_json(sheet, { defval: null }), defaultBasis);
  }

  function extractPricingFromMatrix(matrix, defaultBasis) {
    const entries = new Map();
    if (!Array.isArray(matrix) || !matrix.length) {
      return entries;
    }

    let headerRowIndex = matrix.findIndex((row) =>
      Array.isArray(row) &&
      row.some((cell) => hasGuestValue(cell)) &&
      row.some((cell) => typeof cell === 'string' && cell.trim()));

    if (headerRowIndex === -1) {
      headerRowIndex = 0;
    }

    const headerRow = matrix[headerRowIndex] || [];
    const guestColumns = headerRow
      .map((cell, index) => ({
        index,
        guest: extractGuestValue(cell),
        raw: cell,
        basis: parseChargeType(cell, null) || defaultBasis,
      }))
      .filter((entry) => Number.isFinite(entry.guest));

    if (!guestColumns.length) {
      return entries;
    }

    const labelIndex = (() => {
      const explicit = headerRow.findIndex((cell) => typeof cell === 'string' && /package|option|name|addon|add-on/i.test(cell));
      if (explicit >= 0) {
        return explicit;
      }
      const candidate = headerRow.findIndex((_, index) => !guestColumns.some((entry) => entry.index === index));
      return candidate >= 0 ? candidate : 0;
    })();

    const sortedGuestColumns = guestColumns.sort((a, b) => a.guest - b.guest);

    for (let i = headerRowIndex + 1; i < matrix.length; i += 1) {
      const row = matrix[i];
      if (!Array.isArray(row)) continue;
      const rawLabel = row[labelIndex];
      if (!rawLabel) continue;
      const label = String(rawLabel).trim();
      if (!label) continue;

      const tiers = [];
      sortedGuestColumns.forEach((column, index) => {
        const value = row[column.index];
        const price = toNumber(value);
        if (!Number.isFinite(price)) {
          return;
        }
        const minGuests = index === 0 ? 0 : sortedGuestColumns[index - 1].guest + 1;
        const maxGuests = column.guest;
        tiers.push({
          minGuests,
          maxGuests,
          price,
          basis: column.basis || defaultBasis,
          label: typeof column.raw === 'string' ? column.raw : undefined,
        });
      });

      if (!tiers.length) {
        continue;
      }

      const key = normaliseKey(label);
      const entry = {
        label,
        tiers,
        defaultGuests: tiers[0]?.maxGuests || null,
        defaultBasis: tiers[0]?.basis || defaultBasis,
      };
      registerPricingEntry(entries, entry, [label]);
    }

    return entries;
  }

  function extractPricingFromRows(rows, defaultBasis) {
    const entries = new Map();
    if (!Array.isArray(rows) || !rows.length) {
      return entries;
    }

    rows.forEach((row) => {
      const label = pickFirst(row, ['Package', 'Option', 'Name', 'Addon', 'AddOn', 'Description', 'Label', 'Code']);
      if (!label) {
        return;
      }
      const minGuests = toNumber(pickFirst(row, ['MinGuests', 'GuestsMin', 'Min', 'From', 'Min Pax']));
      const maxGuests = toNumber(pickFirst(row, ['MaxGuests', 'GuestsMax', 'Max', 'To', 'Max Pax']));
      const guestExact = toNumber(pickFirst(row, ['Guests', 'GuestCount', 'Pax']));
      const price = toNumber(pickFirst(row, ['Price', 'Amount', 'Rate', 'Value', 'Cost']));
      if (!Number.isFinite(price)) {
        return;
      }
      const basis = parseChargeType(pickFirst(row, ['ChargeType', 'Basis', 'Billing', 'Per']), row.PerGuest) || defaultBasis;
      const quantity = toNumber(pickFirst(row, ['Qty', 'Quantity']));
      const tier = {
        minGuests: Number.isFinite(minGuests) ? minGuests : 0,
        maxGuests: Number.isFinite(maxGuests)
          ? maxGuests
          : Number.isFinite(guestExact)
          ? guestExact
          : Infinity,
        price,
        basis,
        label: pickFirst(row, ['Label', 'Description', 'Notes']) || undefined,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : undefined,
      };

      let aliasCandidates = [
        label,
        row.PackageID,
        row['Package Id'],
        row.ID,
        row.Code,
        row.SKU,
        row.Slug,
        row['Quote Option'],
        row.QuoteOption,
        row.Item,
        row['Item Name'],
        row.VenueID,
        row['Venue Id'],
        row.Venue,
        row['Venue Name'],
        row.VenueCode,
        row['Venue Code'],
        row.Group,
        row['Venue Group'],
        row.Cluster,
        row['Cluster Name'],
        row['Package Name'],
        row.Package,
        row.Option,
      ].filter(Boolean);

      const venuePackageCombo = (() => {
        const venueKey = pickFirst(row, ['VenueID', 'Venue Id', 'Venue', 'Venue Name', 'VenueCode', 'Venue Code']);
        const packageKey = pickFirst(row, ['PackageID', 'Package Id', 'Package', 'Code', 'Option']);
        if (venueKey && packageKey) {
          return `${venueKey}:${packageKey}`;
        }
        return null;
      })();
      if (venuePackageCombo) {
        aliasCandidates = [...aliasCandidates, venuePackageCombo];
      }

      const groupPackageCombo = (() => {
        const groupKey = pickFirst(row, ['Group', 'Venue Group', 'Cluster']);
        const packageKey = pickFirst(row, ['PackageID', 'Package Id', 'Package', 'Package Name', 'Option']);
        if (groupKey && packageKey) {
          return `${groupKey}:${packageKey}`;
        }
        return null;
      })();
      if (groupPackageCombo) {
        aliasCandidates = [...aliasCandidates, groupPackageCombo];
      }

      aliasCandidates = Array.from(new Set(aliasCandidates));

      const normalizedAliasKeys = aliasCandidates
        .map((value) => normaliseKey(value))
        .filter((value) => value);

      const existing = findPricingForKeys(entries, new Set(normalizedAliasKeys));
      aliasCandidates = [
        label,
        ...aliasCandidates.filter((value) => normaliseKey(value) !== normaliseKey(label)),
      ];
      const entry = existing || {
        label: String(label).trim(),
        tiers: [],
        defaultGuests: tier.maxGuests && tier.maxGuests !== Infinity ? tier.maxGuests : tier.minGuests,
        defaultBasis: basis,
      };
      if (existing) {
        if (!existing.defaultGuests && (Number.isFinite(tier.maxGuests) || Number.isFinite(tier.minGuests))) {
          existing.defaultGuests = Number.isFinite(tier.maxGuests) && tier.maxGuests !== Infinity
            ? tier.maxGuests
            : tier.minGuests;
        }
        if (!existing.defaultBasis && basis) {
          existing.defaultBasis = basis;
        }
      }
      entry.tiers.push(tier);
      registerPricingEntry(entries, entry, aliasCandidates);
    });

    entries.forEach((entry) => {
      entry.tiers.sort((a, b) => (a.minGuests || 0) - (b.minGuests || 0));
    });

    return entries;
  }

  function registerPricingEntry(map, entry, keys = []) {
    if (!entry) {
      return;
    }

    if (!entry.aliases) {
      entry.aliases = new Set();
    }

    const resolvedKeys = keys
      .map((key) => {
        if (key === null || key === undefined) {
          return '';
        }
        return typeof key === 'string' ? key : String(key);
      })
      .filter((value) => value && value.trim());

    if (!entry.primaryKey) {
      const fallbackKey = resolvedKeys[0] || entry.label || `pricing-${map.size + 1}`;
      entry.primaryKey = normaliseKey(fallbackKey);
    }

    const registerKey = (value) => {
      if (!value) return;
      const normalized = normaliseKey(value);
      if (!normalized) return;
      if (!entry.aliases.has(normalized)) {
        entry.aliases.add(normalized);
      }
      if (!map.has(normalized)) {
        map.set(normalized, entry);
      }
    };

    registerKey(entry.primaryKey);
    resolvedKeys.forEach(registerKey);
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

    venueData.forEach((venue, index) => {
      const option = document.createElement('option');
      option.value = venue.id;
      const parts = [venue.name];
      if (venue.location) parts.push(`• ${venue.location}`);
      if (Number.isFinite(venue.capacity)) parts.push(`— up to ${venue.capacity.toLocaleString()} guests`);
      option.textContent = parts.join(' ');
      if (index === 0 && !previousValue) {
        option.selected = true;
      }
      venueSelect.appendChild(option);
    });

    if (previousValue && venueData.some((venue) => venue.id === previousValue)) {
      venueSelect.value = previousValue;
    }
  }

  function populatePackages(previousValue = '') {
    const { venueSelect, packageSelect, guestInput } = state.refs;
    const selectedVenueId = venueSelect.value;
    const guestCount = getGuestCount();
    packageSelect.innerHTML = '';

    const matching = packageData.filter((pkg) => packageMatchesVenue(pkg, selectedVenueId));

    if (!matching.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = selectedVenueId ? 'No packages available for this venue' : 'No packages available';
      option.disabled = true;
      packageSelect.appendChild(option);
      return;
    }

    matching.forEach((pkg) => {
      const option = document.createElement('option');
      option.value = pkg.id;
      option.textContent = buildPackageOptionLabel(pkg, guestCount);
      packageSelect.appendChild(option);
    });

    if (previousValue && matching.some((pkg) => pkg.id === previousValue)) {
      packageSelect.value = previousValue;
    } else if (matching.length) {
      const [first] = matching;
      packageSelect.value = first.id;
      if ((!guestInput.value || guestInput.value === '0') && first.defaultGuests) {
        guestInput.value = first.defaultGuests;
      }
    }
  }

  function populateAddons(previousValues = new Set()) {
    const { addonSelect } = state.refs;
    const guestCount = getGuestCount();
    addonSelect.innerHTML = '';

    if (!addonData.length) {
      const option = document.createElement('option');
      option.textContent = 'No add-ons available in this dataset';
      option.disabled = true;
      addonSelect.appendChild(option);
      return;
    }

    addonData.forEach((addon) => {
      const option = document.createElement('option');
      option.value = addon.id;
      option.textContent = buildAddonOptionLabel(addon, guestCount);
      option.selected = previousValues.has(option.value);
      addonSelect.appendChild(option);
    });
  }

  function updatePackageOptionLabels() {
    if (!state.refs) return;
    const { packageSelect } = state.refs;
    const guestCount = getGuestCount();
    Array.from(packageSelect.options).forEach((option) => {
      const pkg = packageData.find((item) => item.id === option.value);
      if (!pkg) return;
      option.textContent = buildPackageOptionLabel(pkg, guestCount);
    });
  }

  function updateAddonOptionLabels() {
    if (!state.refs) return;
    const { addonSelect } = state.refs;
    const guestCount = getGuestCount();
    Array.from(addonSelect.options).forEach((option) => {
      const addon = addonData.find((item) => item.id === option.value);
      if (!addon) return;
      option.textContent = buildAddonOptionLabel(addon, guestCount);
    });
  }

  function updateQuote() {
    if (!state.refs) return;
    const { guestInput, packageSelect, addonSelect, tableBody, totalValue, guestValue, packageValue } = state.refs;

    const guests = Math.max(0, parseInt(guestInput.value, 10) || 0);
    if (guests !== Number(guestInput.value || 0)) {
      guestInput.value = guests;
    }
    guestValue.textContent = guests.toLocaleString();

    const packageId = packageSelect.value;
    const pkg = packageData.find((item) => item.id === packageId);
    packageValue.textContent = pkg ? pkg.name : '—';

    tableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();
    let subtotal = 0;
    let rowCount = 0;

    if (pkg) {
      const packagePricing = getPackagePrice(pkg, guests);
      const details = buildPackageDetails(pkg, packagePricing);
      fragment.appendChild(
        buildRow(pkg.name, details, packagePricing.quantity, packagePricing.unitPrice, packagePricing.total)
      );
      subtotal += packagePricing.total;
      rowCount++;
    }

    const selectedAddons = Array.from(addonSelect?.selectedOptions || []).map((opt) => opt.value);
    selectedAddons.forEach((addonId) => {
      const addon = addonData.find((item) => item.id === addonId);
      if (!addon) return;
      const addonPricing = getAddonPrice(addon, guests);
      const details = buildAddonDetails(addon, addonPricing);
      fragment.appendChild(
        buildRow(addon.name, details, addonPricing.quantity, addonPricing.unitPrice, addonPricing.total)
      );
      subtotal += addonPricing.total;
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

    updatePackageOptionLabels();
    updateAddonOptionLabels();
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
    const rows = Array.from(table.rows).map((tr) =>
      new docx.TableRow({
        children: Array.from(tr.cells).map((cell) =>
          new docx.TableCell({
            children: [new docx.Paragraph(cell.textContent)],
          })
        ),
      })
    );
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

  function buildPackageOptionLabel(pkg, guestCount) {
    const preview = getPackagePrice(pkg, guestCount);
    const guestsLabel = preview.guestsUsed
      ? `${preview.guestsUsed.toLocaleString()} guests`
      : guestCount
      ? `${guestCount.toLocaleString()} guests`
      : 'Guest count pending';
    const priceLabel = preview.basis === BASIS.PER_GUEST
      ? `${formatCurrency(preview.unitPrice)} per guest`
      : formatCurrency(preview.total);
    return `${pkg.name} — ${guestsLabel} — ${priceLabel}`;
  }

  function buildAddonOptionLabel(addon, guestCount) {
    const preview = getAddonPrice(addon, guestCount);
    const priceLabel = preview.basis === BASIS.PER_GUEST
      ? `${formatCurrency(preview.unitPrice)} per guest`
      : formatCurrency(preview.total);
    if (addon.category) {
      return `${addon.name} — ${priceLabel} (${addon.category})`;
    }
    return `${addon.name} — ${priceLabel}`;
  }

  function buildPackageDetails(pkg, pricing) {
    const details = [];
    if (pricing.guestsUsed) {
      details.push(`${pricing.guestsUsed.toLocaleString()} guests`);
    }
    if (pkg.duration) {
      details.push(pkg.duration);
    }
    if (pricing.tier?.label) {
      details.push(pricing.tier.label);
    }
    if (pricing.basis === BASIS.PER_GUEST) {
      details.push('Billed per guest');
    }
    if (pkg.description) {
      details.push(pkg.description);
    }
    return details.join(' • ');
  }

  function buildAddonDetails(addon, pricing) {
    const details = [];
    if (addon.category) {
      details.push(addon.category);
    }
    if (pricing.guestsUsed && pricing.basis === BASIS.PER_GUEST) {
      details.push(`${pricing.guestsUsed.toLocaleString()} guests`);
    }
    if (pricing.tier?.label) {
      details.push(pricing.tier.label);
    }
    if (addon.description) {
      details.push(addon.description);
    }
    return details.join(' • ');
  }

  function buildRow(name, details, qty, price, total) {
    const tr = document.createElement('tr');
    const values = [
      name || '—',
      details || '—',
      Number.isFinite(qty) ? qty.toLocaleString() : '1',
      formatCurrency(price),
      formatCurrency(Number.isFinite(total) ? total : price * (Number.isFinite(qty) ? qty : 1)),
    ];
    values.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    return tr;
  }

  function getGuestCount() {
    if (!state.refs?.guestInput) return 0;
    const guests = parseInt(state.refs.guestInput.value, 10);
    return Number.isFinite(guests) && guests > 0 ? guests : 0;
  }

  function packageMatchesVenue(pkg, venueId) {
    if (!venueId) {
      return true;
    }
    const venue = venueData.find((item) => item.id === venueId);
    if (!venue) {
      return true;
    }
    const venueKeys = new Set([
      venue.id,
      venue.name,
      venue.group,
    ].filter(Boolean).map((value) => normaliseKey(value)));
    if (pkg.venueId && venueKeys.has(normaliseKey(pkg.venueId))) {
      return true;
    }
    if (pkg.group && venueKeys.has(normaliseKey(pkg.group))) {
      return true;
    }
    return !pkg.venueId && !pkg.group;
  }

  function getPackagePrice(pkg, guests) {
    const tiers = pkg.pricing || [];
    const fallbackGuests = pkg.defaultGuests || tiers[0]?.maxGuests || tiers[0]?.minGuests || guests;
    const guestCount = guests > 0 ? guests : fallbackGuests || 0;
    const tier = resolveTier(tiers, guestCount);
    const basis = tier?.basis || pkg.chargeType || BASIS.FLAT;
    const unitPrice = Number.isFinite(tier?.price) ? tier.price : Number.isFinite(pkg.basePrice) ? pkg.basePrice : 0;
    const guestsUsed = guestCount || tier?.maxGuests || tier?.minGuests || 0;
    const quantity = basis === BASIS.PER_GUEST ? Math.max(1, guestsUsed) : tier?.quantity ? tier.quantity : 1;
    const total = unitPrice * quantity;
    return {
      unitPrice,
      quantity,
      total,
      basis,
      guestsUsed,
      tier,
    };
  }

  function getAddonPrice(addon, guests) {
    const tiers = addon.pricing || [];
    const fallbackGuests = guests || tiers[0]?.maxGuests || tiers[0]?.minGuests || 0;
    const guestCount = guests > 0 ? guests : fallbackGuests;
    const tier = resolveTier(tiers, guestCount);
    const basis = tier?.basis || addon.chargeType || BASIS.FLAT;
    const unitPrice = Number.isFinite(tier?.price)
      ? tier.price
      : Number.isFinite(addon.basePrice)
      ? addon.basePrice
      : 0;
    const quantityFromTier = Number.isFinite(tier?.quantity) && tier.quantity > 0 ? tier.quantity : undefined;
    let quantity;
    if (quantityFromTier) {
      quantity = quantityFromTier;
    } else if (basis === BASIS.PER_GUEST) {
      quantity = Math.max(1, guestCount || 0);
    } else {
      quantity = addon.defaultQty && addon.defaultQty > 0 ? addon.defaultQty : 1;
    }
    const guestsUsed = basis === BASIS.PER_GUEST ? Math.max(1, guestCount || 0) : guestCount || 0;
    const total = unitPrice * quantity;
    return {
      unitPrice,
      quantity,
      total,
      basis,
      guestsUsed,
      tier,
    };
  }

  function resolveTier(tiers, guests) {
    if (!Array.isArray(tiers) || !tiers.length) {
      return null;
    }
    const sorted = tiers.slice().sort((a, b) => (a.minGuests || 0) - (b.minGuests || 0));
    const match = sorted.find((tier) => {
      const min = Number.isFinite(tier.minGuests) ? tier.minGuests : 0;
      const max = Number.isFinite(tier.maxGuests) ? tier.maxGuests : Infinity;
      return guests >= min && guests <= max;
    });
    return match || sorted[sorted.length - 1];
  }

  function findSheet(workbook, names) {
    return names
      .map((name) => workbook.Sheets[name])
      .find((sheet) => sheet);
  }

  function findPricingForKeys(map, keys) {
    if (!map || !keys?.size) {
      return null;
    }
    for (const key of keys) {
      if (!key) continue;
      const entry = map.get(key);
      if (entry) {
        return entry;
      }
    }
    return null;
  }

  function matchesKey(pkg, key) {
    const normalized = normaliseKey(key);
    return [
      pkg.id,
      pkg.name,
      pkg.group,
      pkg.venueId,
      pkg.source?.PackageID,
      pkg.source?.['Package Id'],
      pkg.source?.Code,
      pkg.source?.SKU,
      pkg.source?.Slug,
      pkg.source?.VenueID,
      pkg.source?.['Venue Id'],
      pkg.source?.Venue,
      pkg.source?.['Venue Name'],
      pkg.source?.VenueCode,
      pkg.source?.['Venue Code'],
      pkg.source?.['Quote Option'],
      pkg.source?.QuoteOption,
      pkg.source?.Item,
      pkg.source?.['Item Name'],
      pkg.venueId && pkg.id ? `${pkg.venueId}:${pkg.id}` : null,
      pkg.source?.VenueID && pkg.id ? `${pkg.source.VenueID}:${pkg.id}` : null,
      pkg.source?.['Venue Id'] && pkg.id ? `${pkg.source['Venue Id']}:${pkg.id}` : null,
      pkg.source?.Venue && pkg.source?.Package ? `${pkg.source.Venue}:${pkg.source.Package}` : null,
      pkg.group && pkg.source?.Package ? `${pkg.group}:${pkg.source.Package}` : null,
      pkg.group && pkg.name ? `${pkg.group}:${pkg.name}` : null,
    ]
      .filter(Boolean)
      .some((value) => normaliseKey(value) === normalized);
  }

  function hasGuestValue(value) {
    return Number.isFinite(extractGuestValue(value));
  }

  function extractGuestValue(value) {
    if (Number.isFinite(value)) {
      return value;
    }
    if (!value) {
      return NaN;
    }
    const match = String(value)
      .replace(/[,\s]/g, '')
      .match(/(-?\d+(?:\.\d+)?)/);
    if (!match) {
      return NaN;
    }
    return Number(match[1]);
  }

  function parseChargeType(value, fallback) {
    if (typeof value === 'string') {
      const normalised = value.trim().toLowerCase();
      if (/guest|person|per guest|per-person|per person|pp/.test(normalised)) {
        return BASIS.PER_GUEST;
      }
      if (/flat|package|total|event|once|fixed/.test(normalised)) {
        return BASIS.FLAT;
      }
    }
    if (typeof fallback === 'boolean') {
      return fallback ? BASIS.PER_GUEST : BASIS.FLAT;
    }
    if (typeof fallback === 'number') {
      return fallback === 1 ? BASIS.PER_GUEST : BASIS.FLAT;
    }
    return null;
  }

  function pickFirst(row, keys) {
    if (!row) return null;
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== null && row[key] !== undefined && row[key] !== '') {
        return row[key];
      }
    }
    return null;
  }

  function toNumber(value) {
    if (value === null || value === undefined || value === '') {
      return NaN;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : NaN;
    }
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    const stringValue = String(value).trim();
    if (!stringValue) {
      return NaN;
    }
    const cleaned = stringValue
      .replace(/[^0-9,.-]/g, '')
      .replace(/,(?=\d{3}(\D|$))/g, '')
      .replace(/,/g, '.');
    const number = Number(cleaned);
    return Number.isFinite(number) ? number : NaN;
  }

  function normaliseKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function normalisePercentage(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    if (value > 1.5) {
      return value / 100;
    }
    return value;
  }

  function formatCurrency(value) {
    return currencyFormatter.format(Number.isFinite(value) ? value : 0);
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

  function clone(item) {
    if (typeof structuredClone === 'function') {
      return structuredClone(item);
    }
    return JSON.parse(JSON.stringify(item));
  }
})();
