(() => {
  const BASIS = {
    FLAT: 'flat',
    PER_GUEST: 'perGuest',
  };

  const CHARGE_UNIT = {
    PER_PERSON: 'perPerson',
    PER_CHILD: 'perChild',
    PER_EVENT: 'perEvent',
    PER_HOUR: 'perHour',
    PER_UNIT: 'perUnit',
    PER_SQM: 'perSqm',
  };

  const WEEKEND_PERCENT_DISCOUNT = -0.05;
  const SPECIAL_PACKAGE_SIN_ALIMENTOS = 'P013';
  const SPECIAL_REFERENCE_PACKAGE_TAQUIZA = 'P001';

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

  let workbookModel = null;
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
      compareSection: document.getElementById('quoteCompare'),
      compareSummary: document.getElementById('quoteCompareSummary'),
      compareTableHead: document.querySelector('#quoteCompareTable thead'),
      compareTableBody: document.querySelector('#quoteCompareTable tbody'),
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

    refs.addonSelect.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        updateQuote();
      }
    });
    refs.guestInput.addEventListener('input', updateQuote);

    refs.exportPdf?.addEventListener('click', exportPdf);
    refs.exportDocx?.addEventListener('click', exportDocx);
    refs.exportXlsx?.addEventListener('click', exportXlsx);

    loadDefaultData();
    announceStatus('Sample data loaded. Choose a venue to get started.', 'success');
  });

  function loadDefaultData() {
    workbookModel = null;
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
        const message = error?.message
          ? error.message
          : 'We could not read that workbook. Ensure it includes Venues, Packages, Pricing, and AddOns data.';
        announceStatus(message, 'error');
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
    const parsed = parseDatabaseWorkbook(workbook);
    workbookModel = parsed;
    venueData = parsed.venues.map(clone);
    packageData = parsed.packages.map(clone);
    addonData = parsed.addons.map(clone);
    refreshSelectors();
    updateQuote();
  }

  function parseDatabaseWorkbook(workbook) {
    const venuesSheet = findSheet(workbook, ['Venues', 'VENUES', 'venues']);
    const packagesSheet = findSheet(workbook, ['Packages', 'PACKAGES', 'packages']);
    const pricingSheet = findSheet(workbook, ['Pricing', 'PRICING', 'pricing']);
    if (!venuesSheet || !packagesSheet || !pricingSheet) {
      throw new Error('The workbook must include Venues, Packages, and Pricing sheets.');
    }

    const tierLookupSheet = findSheet(workbook, ['TierLookup', 'Tier Lookup', 'Tiers']);
    const addonsSheet = findSheet(workbook, ['AddOns', 'ADDONS', 'Add Ons', 'Add-Ons']);
    const addonPricingSheet = findSheet(workbook, ['AddOnPricing', 'AddonPricing', 'Add On Pricing', 'ADDONPRICING']);
    const venueFlatDiscountsSheet = findSheet(workbook, ['VenueFlatDiscounts', 'Venue Flat Discounts', 'FlatDiscounts']);
    const quoteSheet = findSheet(workbook, ['Quote', 'QUOTE', 'Compare_Prices']);
    const quoteAddOnsSheet = findSheet(workbook, ['Quote_AddOns', 'Quote AddOns', 'Quote_Addons', 'QUOTE_ADDONS']);

    const venues = parseDatabaseVenues(venuesSheet);
    const packages = parseDatabasePackages(packagesSheet);
    ensureUniqueBy(venues, (item) => item.name?.toLowerCase(), 'venue name');
    ensureUniqueBy(packages, (item) => item.name?.toLowerCase(), 'package name');

    const tierLookup = parseTierLookup(tierLookupSheet);
    const { pricingByKey, packageVenueMap } = parseDatabasePricing(pricingSheet);
    if (!pricingByKey.size) {
      throw new Error('No pricing rows were detected. Ensure the Pricing sheet uses VenueID | PackageID | TierID keys.');
    }

    const addonsResult = parseDatabaseAddOns(addonsSheet, quoteAddOnsSheet);
    const addonOverrides = parseAddonOverrides(addonPricingSheet);
    const flatDiscounts = parseVenueFlatDiscounts(venueFlatDiscountsSheet);
    const eventDate = parseWorkbookEventDate(quoteSheet);

    const venuesById = new Map(venues.map((venue) => [normalizeId(venue.id), venue]));
    const venuesByName = new Map(venues.map((venue) => [venue.name.toLowerCase(), venue]));
    const packagesById = new Map(packages.map((pkg) => [normalizeId(pkg.id), pkg]));
    const packagesByName = new Map(packages.map((pkg) => [pkg.name.toLowerCase(), pkg]));

    const defaultGuests = tierLookup.defaultGuests || 100;
    packages.forEach((pkg) => {
      const venueSet = packageVenueMap.get(normalizeId(pkg.id)) || new Set();
      pkg.availableVenueIds = Array.from(venueSet);
      if (!pkg.defaultGuests && defaultGuests) {
        pkg.defaultGuests = defaultGuests;
      }
      pkg.sourceType = 'database';
    });

    addonsResult.addons.forEach((addon) => {
      addon.sourceType = 'database';
    });

    return {
      venues,
      packages,
      addons: addonsResult.addons,
      venuesById,
      venuesByName,
      packagesById,
      packagesByName,
      pricingByKey,
      tierLookup,
      addonOverrides,
      flatDiscounts,
      addonsById: addonsResult.addonsById,
      defaultGuests,
      eventDate,
    };
  }

  function parseDatabaseVenues(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const venues = rows
      .map((row) => {
        const id = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'ID', 'Code']));
        const nameRaw = pickFirst(row, ['Name', 'Venue', 'VenueName', 'Title']);
        if (!id || !nameRaw) {
          return null;
        }
        const name = String(nameRaw).trim();
        const location = pickFirst(row, ['Location', 'Address', 'City', 'Estado', 'Country']);
        const horario = pickFirst(row, ['Horario', 'Schedule']);
        const maxCapacity = toNumber(pickFirst(row, ['MaxCapacity', 'Max Guests', 'Capacity']));
        const group = pickFirst(row, ['Grupo', 'Group']);
        return {
          id,
          name,
          location: location ? String(location).trim() : '',
          horario: horario ? String(horario).trim() : '',
          capacity: Number.isFinite(maxCapacity) ? maxCapacity : null,
          group: group ? String(group).trim() : '',
          source: row,
        };
      })
      .filter(Boolean);

    if (!venues.length) {
      throw new Error('No venues found in the Venues sheet.');
    }

    return venues;
  }

  function parseDatabasePackages(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const packages = rows
      .map((row) => {
        const id = normalizeId(pickFirst(row, ['PackageID', 'Package Id', 'ID', 'Code']));
        const nameRaw = pickFirst(row, ['Name', 'Package', 'PackageName', 'Title']);
        if (!id || !nameRaw) {
          return null;
        }
        const name = String(nameRaw).trim();
        const type = pickFirst(row, ['Type']);
        const description = pickFirst(row, ['Description', 'Summary', 'Notes']);
        const group = pickFirst(row, ['Grupo', 'Group']);
        return {
          id,
          name,
          type: type ? String(type).trim() : '',
          description: description ? String(description).trim() : '',
          group: group ? String(group).trim() : '',
          defaultGuests: null,
          availableVenueIds: [],
          source: row,
        };
      })
      .filter(Boolean);

    if (!packages.length) {
      throw new Error('No packages found in the Packages sheet.');
    }

    return packages;
  }

  function ensureUniqueBy(items, iteratee, label) {
    const seen = new Map();
    items.forEach((item) => {
      const key = iteratee(item);
      if (!key) return;
      if (seen.has(key)) {
        throw new Error(`Duplicate ${label} detected: "${item.name || item.id}".`);
      }
      seen.set(key, item);
    });
  }

  function parseTierLookup(sheet) {
    const entries = [];
    if (sheet) {
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
      rows.forEach((row) => {
        const guests = toNumber(pickFirst(row, ['Guests', 'GuestCount', 'Pax']));
        const tierIdRaw = pickFirst(row, ['TierID', 'Tier Id', 'Tier']);
        if (!Number.isFinite(guests) || !tierIdRaw) {
          return;
        }
        entries.push({
          guests: Math.round(guests),
          tierId: normaliseTierId(tierIdRaw),
        });
      });
    }

    entries.sort((a, b) => a.guests - b.guests);
    const map = new Map(entries.map((entry) => [entry.guests, entry.tierId]));
    const defaultGuests = entries.find((entry) => entry.guests > 0)?.guests || null;
    return { entries, map, defaultGuests };
  }

  function parseDatabasePricing(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const pricingByKey = new Map();
    const packageVenueMap = new Map();

    rows.forEach((row) => {
      let venueId = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'Venue']));
      let packageId = normalizeId(pickFirst(row, ['PackageID', 'Package Id', 'Package']));
      let tierId = normaliseTierId(pickFirst(row, ['TierID', 'Tier Id', 'Tier']));
      const compositeKey = pickFirst(row, ['Key', 'CompositeKey']);

      if ((!venueId || !packageId || !tierId) && compositeKey) {
        const parts = String(compositeKey).split('|');
        if (parts[0] && !venueId) venueId = normalizeId(parts[0]);
        if (parts[1] && !packageId) packageId = normalizeId(parts[1]);
        if (parts[2] && !tierId) tierId = normaliseTierId(parts[2]);
      }

      if (!venueId || !packageId || !tierId) {
        return;
      }

      const basePrice = toNumber(pickFirst(row, ['BasePrice', 'Price', 'Amount', 'Value']));
      if (!Number.isFinite(basePrice)) {
        return;
      }

      const key = buildPricingKey(venueId, packageId, tierId);
      if (!pricingByKey.has(key)) {
        pricingByKey.set(key, {
          venueId,
          packageId,
          tierId,
          basePrice,
          dayType: pickFirst(row, ['DayType', 'Day Type', 'Type']) || null,
        });
      } else {
        pricingByKey.get(key).basePrice = basePrice;
      }

      const packageKey = normalizeId(packageId);
      if (!packageVenueMap.has(packageKey)) {
        packageVenueMap.set(packageKey, new Set());
      }
      packageVenueMap.get(packageKey).add(normalizeId(venueId));
    });

    return { pricingByKey, packageVenueMap };
  }

  function parseDatabaseAddOns(addonsSheet, quoteAddOnsSheet) {
    const addons = [];
    const addonsById = new Map();

    if (addonsSheet) {
      const rows = XLSX.utils.sheet_to_json(addonsSheet, { defval: null });
      rows.forEach((row) => {
        const id = normalizeId(pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'ID', 'Code']));
        const nameRaw = pickFirst(row, ['Name', 'AddOn', 'Addon', 'Title']);
        if (!id || !nameRaw) {
          return;
        }
        const name = String(nameRaw).trim();
        const chargeUnit = normaliseChargeUnit(pickFirst(row, ['ChargeUnit', 'Charge Unit', 'ChargeType', 'Charge Type']));
        const chargeType = chargeUnit === CHARGE_UNIT.PER_PERSON ? BASIS.PER_GUEST : BASIS.FLAT;
        const defaultPrice = toNumber(pickFirst(row, ['DefaultPrice', 'Price', 'BasePrice', 'Amount']));
        const resolvedDefaultPrice = Number.isFinite(defaultPrice) ? defaultPrice : 0;
        const category = pickFirst(row, ['Category', 'Grupo', 'Group']);
        const description = pickFirst(row, ['Description', 'Summary', 'Notes']);
        const defaults = {
          guests: sanitizeQuantity(toNumber(pickFirst(row, ['Guests', 'GuestCount']))),
          children: sanitizeQuantity(toNumber(pickFirst(row, ['Children', 'ChildCount', 'Kids']))),
          hours: sanitizeQuantity(toNumber(pickFirst(row, ['Hours', 'DefaultHours']))),
          quantity: sanitizeQuantity(toNumber(pickFirst(row, ['DefaultQty', 'Qty', 'Quantity']))),
          sqm: sanitizeQuantity(toNumber(pickFirst(row, ['Sqm', 'SquareMeters', 'm2']))),
        };
        const defaultQty = Number.isFinite(defaults.quantity) ? defaults.quantity : 0;
        const addon = {
          id,
          name,
          chargeUnit,
          chargeType,
          defaultPrice: resolvedDefaultPrice,
          basePrice: resolvedDefaultPrice,
          category: category ? String(category).trim() : '',
          description: description ? String(description).trim() : '',
          defaults,
          defaultQty,
          source: row,
        };
        addons.push(addon);
        addonsById.set(id, addon);
      });
    }

    if (quoteAddOnsSheet) {
      const quoteRows = XLSX.utils.sheet_to_json(quoteAddOnsSheet, { defval: null });
      quoteRows.forEach((row) => {
        const addOnId = normalizeId(pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'AddOn']));
        if (!addOnId) return;
        const addon = addonsById.get(addOnId);
        if (!addon) return;
        const defaults = addon.defaults;
        const guests = sanitizeQuantity(toNumber(pickFirst(row, ['Guests', 'GuestCount'])));
        const children = sanitizeQuantity(toNumber(pickFirst(row, ['Children', 'ChildCount', 'Kids'])));
        const hours = sanitizeQuantity(toNumber(pickFirst(row, ['Hours', 'QtyHours'])));
        const quantity = sanitizeQuantity(toNumber(pickFirst(row, ['Qty', 'Quantity'])));
        const sqm = sanitizeQuantity(toNumber(pickFirst(row, ['Sqm', 'SquareMeters', 'm2'])));
        if (!Number.isFinite(defaults.guests) && Number.isFinite(guests)) defaults.guests = guests;
        if (!Number.isFinite(defaults.children) && Number.isFinite(children)) defaults.children = children;
        if (!Number.isFinite(defaults.hours) && Number.isFinite(hours)) defaults.hours = hours;
        if (!Number.isFinite(defaults.quantity) && Number.isFinite(quantity)) defaults.quantity = quantity;
        if (!Number.isFinite(defaults.sqm) && Number.isFinite(sqm)) defaults.sqm = sqm;
        if (Number.isFinite(defaults.quantity)) {
          addon.defaultQty = defaults.quantity;
        }
      });
    }

    return { addons, addonsById };
  }

  function parseAddonOverrides(sheet) {
    const overrides = new Map();
    if (!sheet) {
      return overrides;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    rows.forEach((row) => {
      const venueId = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'Venue']));
      const addOnId = normalizeId(pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'AddOn']));
      const price = toNumber(pickFirst(row, ['Price', 'Amount', 'OverridePrice', 'Value']));
      if (!venueId || !addOnId || !Number.isFinite(price)) {
        return;
      }
      overrides.set(buildAddonOverrideKey(venueId, addOnId), price);
    });
    return overrides;
  }

  function parseVenueFlatDiscounts(sheet) {
    const discounts = new Map();
    if (!sheet) {
      return discounts;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    rows.forEach((row) => {
      const venueId = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'Venue']));
      const dow = toNumber(pickFirst(row, ['DOW', 'DayOfWeek', 'Day']));
      const value = toNumber(pickFirst(row, ['FlatDiscount', 'Discount', 'Amount']));
      if (!venueId || !Number.isFinite(dow) || !Number.isFinite(value)) {
        return;
      }
      const weekday = Math.round(dow);
      discounts.set(`${venueId}|${weekday}`, value);
    });
    return discounts;
  }

  function parseWorkbookEventDate(sheet) {
    if (!sheet) {
      return null;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    for (const row of rows) {
      const value = pickFirst(row, ['EventDate', 'Event Date', 'Date']);
      const date = parseExcelDate(value);
      if (date) {
        return date;
      }
    }
    return null;
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
    const previousAddons = new Set(
      Array.from(addonSelect?.querySelectorAll('input[type="checkbox"]:checked') || []).map((input) => input.value)
    );

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
    const selectedVenueIdRaw = venueSelect.value;
    const selectedVenueId = normalizeId(selectedVenueIdRaw);
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
    const venueId = getSelectedVenueId();
    addonSelect.innerHTML = '';

    if (!addonData.length) {
      const empty = document.createElement('p');
      empty.className = 'addon-empty';
      empty.textContent = 'No add-ons available in this dataset';
      addonSelect.appendChild(empty);
      return;
    }

    const categories = [];
    const categoryMap = new Map();

    addonData.forEach((addon) => {
      const rawCategory = addon.category ? String(addon.category).trim() : '';
      const categoryKey = rawCategory || '__misc__';
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          key: categoryKey,
          label: rawCategory || 'Other add-ons',
          addons: [],
        });
        categories.push(categoryMap.get(categoryKey));
      }
      categoryMap.get(categoryKey).addons.push(addon);
    });

    categories.forEach((group, index) => {
      if (!group.addons.length) return;

      const groupWrapper = document.createElement('section');
      groupWrapper.className = 'addon-category';
      groupWrapper.setAttribute('role', 'group');
      const headingId = `addon-category-${index}`;
      groupWrapper.setAttribute('aria-labelledby', headingId);

      const heading = document.createElement('p');
      heading.id = headingId;
      heading.className = 'addon-category-title';
      heading.textContent = group.label;

      const list = document.createElement('div');
      list.className = 'addon-category-list';

      group.addons.forEach((addon) => {
        const wrapper = document.createElement('label');
        wrapper.className = 'addon-checkbox';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = addon.id;
        input.checked = previousValues.has(addon.id);

        const copy = document.createElement('span');
        copy.className = 'addon-checkbox-text';
        copy.textContent = buildAddonOptionLabel(addon, guestCount, venueId);

        wrapper.append(input, copy);
        list.appendChild(wrapper);
      });

      groupWrapper.append(heading, list);
      addonSelect.appendChild(groupWrapper);
    });
  }

  function updatePackageOptionLabels() {
    if (!state.refs) return;
    const { packageSelect } = state.refs;
    const venueId = getSelectedVenueId();
    const guestCount = getGuestCount();
    Array.from(packageSelect.options).forEach((option) => {
      const pkg = packageData.find((item) => item.id === option.value);
      if (!pkg) return;
      option.textContent = buildPackageOptionLabel(pkg, guestCount, venueId);
    });
  }

  function updateAddonOptionLabels() {
    if (!state.refs) return;
    const { addonSelect } = state.refs;
    const venueId = getSelectedVenueId();
    const guestCount = getGuestCount();
    if (!addonSelect) return;
    addonSelect.querySelectorAll('.addon-checkbox').forEach((wrapper) => {
      const input = wrapper.querySelector('input[type="checkbox"]');
      const label = wrapper.querySelector('.addon-checkbox-text');
      if (!input || !label) return;
      const addon = addonData.find((item) => item.id === input.value);
      if (!addon) return;
      label.textContent = buildAddonOptionLabel(addon, guestCount, venueId);
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

    const venueId = getSelectedVenueId();
    const eventDate = getWorkbookEventDate();
    const weekday = getIsoWeekday(eventDate);
    const weekdayLabel = describeWeekday(weekday);

    tableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();
    let subtotal = 0;
    let rowCount = 0;

    if (pkg) {
      const packagePricing = getPackagePrice(pkg, guests, venueId);
      const details = buildPackageDetails(pkg, packagePricing);
      fragment.appendChild(
        buildRow(pkg.name, details, packagePricing.quantity, packagePricing.unitPrice, packagePricing.total)
      );
      subtotal += packagePricing.total;
      rowCount++;
    }

    const selectedAddons = Array.from(
      addonSelect?.querySelectorAll('input[type="checkbox"]:checked') || []
    ).map((input) => input.value);
    selectedAddons.forEach((addonId) => {
      const addon = addonData.find((item) => item.id === addonId);
      if (!addon) return;
      const addonPricing = getAddonPrice(addon, guests, venueId);
      const details = buildAddonDetails(addon, addonPricing);
      fragment.appendChild(
        buildRow(addon.name, details, addonPricing.quantity, addonPricing.unitPrice, addonPricing.total)
      );
      subtotal += addonPricing.total;
      rowCount++;
    });

    let percentAdjustment = 0;
    let percentLabel = '';
    let flatDiscount = 0;
    if (workbookModel && venueId) {
      const percent = getPercentDiscount(eventDate);
      percentAdjustment = subtotal * percent;
      if (percentAdjustment) {
        const magnitude = Math.abs(percent * 100).toFixed(0);
        percentLabel = percent < 0 ? `${magnitude}% weekend discount (${weekdayLabel})` : `${magnitude}% surcharge (${weekdayLabel})`;
        fragment.appendChild(
          buildRow(
            percent < 0 ? 'Percent discount' : 'Percent adjustment',
            percentLabel || `Event day: ${weekdayLabel}`,
            1,
            percentAdjustment,
            percentAdjustment
          )
        );
        rowCount++;
      }

      flatDiscount = getFlatDiscount(venueId, eventDate);
      if (flatDiscount) {
        fragment.appendChild(
          buildRow(
            flatDiscount < 0 ? 'Flat discount' : 'Flat adjustment',
            `Venue rule — ${weekdayLabel}`,
            1,
            flatDiscount,
            flatDiscount
          )
        );
        rowCount++;
      }
    }

    const grandTotal = subtotal + percentAdjustment + flatDiscount;

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
      totalValueCell.textContent = formatCurrency(grandTotal);
      totalRow.append(totalLabel, totalValueCell);
      tableBody.appendChild(totalRow);
    }

    totalValue.textContent = formatCurrency(grandTotal);

    updatePackageOptionLabels();
    updateAddonOptionLabels();
    updateComparePricesTable(guests, eventDate, venueId, packageId, weekdayLabel);
  }

  function updateComparePricesTable(guestCount, eventDate, selectedVenueId, selectedPackageId, weekdayLabel) {
    const { compareTableBody, compareSummary, compareTableHead } = state.refs || {};
    if (!compareTableBody || !compareTableHead) {
      return;
    }

    const normalizedSelectedVenue = selectedVenueId ? normalizeId(selectedVenueId) : '';
    const normalizedSelectedPackage = selectedPackageId ? normalizeId(selectedPackageId) : '';

    const comparisons = buildPackageComparisons(guestCount, eventDate);

    const packageMap = new Map();
    comparisons.forEach((entry) => {
      if (!packageMap.has(entry.packageKey)) {
        packageMap.set(entry.packageKey, {
          key: entry.packageKey,
          name: entry.packageName || entry.packageKey,
        });
      }
    });
    if (!packageMap.size && packageData.length) {
      packageData.forEach((pkg) => {
        const key = normalizeId(pkg.id || pkg.name);
        if (!key || packageMap.has(key)) {
          return;
        }
        packageMap.set(key, {
          key,
          name: pkg.name || pkg.id || key,
        });
      });
    }

    const packages = Array.from(packageMap.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    compareTableHead.innerHTML = '';
    const headerRow = document.createElement('tr');
    const baseHeaders = [
      { label: 'Venue' },
      { label: 'Tier' },
      { label: 'Guests' },
    ];
    baseHeaders.forEach((item) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = item.label;
      headerRow.appendChild(th);
    });
    packages.forEach((pkg) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.className = 'package-heading';
      th.textContent = pkg.name || pkg.key;
      headerRow.appendChild(th);
    });
    compareTableHead.appendChild(headerRow);

    compareTableBody.innerHTML = '';

    if (!comparisons.length) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-row';
      const cell = document.createElement('td');
      cell.colSpan = baseHeaders.length + Math.max(packages.length, 1);
      cell.className = 'empty';
      cell.textContent = guestCount > 0
        ? 'No comparable packages were found for the selected guest count.'
        : 'Enter a guest count to see pricing comparisons.';
      emptyRow.appendChild(cell);
      compareTableBody.appendChild(emptyRow);
      if (compareSummary) {
        const guestLabel = guestCount > 0
          ? `${guestCount.toLocaleString()} guest${guestCount === 1 ? '' : 's'}`
          : 'your current filters';
        compareSummary.textContent = `No comparable packages were found for ${guestLabel}.`;
      }
      return;
    }

    const venueBuckets = new Map();
    comparisons.forEach((entry) => {
      let bucket = venueBuckets.get(entry.venueKey);
      if (!bucket) {
        bucket = {
          key: entry.venueKey,
          name: entry.venueName || entry.venueKey,
          entries: new Map(),
          tierLabel: entry.tierLabel || '',
          tierId: entry.tierId || '',
          guests: entry.guestsUsed || Math.max(0, Math.round(guestCount || 0)),
          minTotal: entry.total,
        };
        venueBuckets.set(entry.venueKey, bucket);
      }
      bucket.entries.set(entry.packageKey, entry);
      if (entry.tierLabel) {
        bucket.tierLabel = entry.tierLabel;
      }
      if (entry.tierId) {
        bucket.tierId = entry.tierId;
      }
      if (entry.guestsUsed) {
        bucket.guests = entry.guestsUsed;
      }
      if (entry.total < bucket.minTotal) {
        bucket.minTotal = entry.total;
      }
    });

    const venues = Array.from(venueBuckets.values());
    venues.sort((a, b) => {
      const diff = a.minTotal - b.minTotal;
      if (Math.abs(diff) > 0.01) {
        return diff;
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    const totals = comparisons.map((entry) => entry.total);
    const minTotal = Math.min(...totals);
    const maxTotal = Math.max(...totals);
    const range = Math.max(0, maxTotal - minTotal);

    let activeCellSummary = '';
    const bestEntry = comparisons.reduce((best, entry) => (entry.total < best.total ? entry : best), comparisons[0]);

    venues.forEach((venue) => {
      const row = document.createElement('tr');

      const venueCell = document.createElement('th');
      venueCell.scope = 'row';
      venueCell.textContent = venue.name || '—';
      row.appendChild(venueCell);

      const tierCell = document.createElement('td');
      tierCell.textContent = venue.tierLabel || (venue.tierId ? `Tier ${venue.tierId}` : '—');
      row.appendChild(tierCell);

      const guestsCell = document.createElement('td');
      guestsCell.textContent = venue.guests ? venue.guests.toLocaleString() : '—';
      row.appendChild(guestsCell);

      let rowHasActive = false;

      packages.forEach((pkg) => {
        const cell = document.createElement('td');
        cell.className = 'compare-cell';
        const match = venue.entries.get(pkg.key);
        if (match) {
          const price = document.createElement('span');
          price.className = 'price';
          price.textContent = formatCurrency(match.total);
          cell.appendChild(price);

          const metaParts = [`Base ${formatCurrency(match.basePrice)}`];
          if (Math.abs(match.percentAdjustment) > 0.01) {
            const percentLabel = match.percentAdjustment < 0 ? 'Weekend' : 'Percent';
            metaParts.push(`${percentLabel} ${formatCurrency(match.percentAdjustment)}`);
          }
          if (Math.abs(match.flatAdjustment) > 0.01) {
            const flatLabel = match.flatAdjustment < 0 ? 'Flat discount' : 'Flat adjustment';
            metaParts.push(`${flatLabel} ${formatCurrency(match.flatAdjustment)}`);
          }
          const metaText = metaParts.join(' • ');
          if (metaText) {
            const meta = document.createElement('span');
            meta.className = 'meta';
            meta.textContent = metaText;
            cell.appendChild(meta);
            cell.title = `${match.venueName} • ${match.packageName}\n${metaText}`;
          } else {
            cell.title = `${match.venueName} • ${match.packageName}`;
          }

          if (range > 0) {
            const relative = (match.total - minTotal) / range;
            cell.classList.add(getHeatClass(relative));
          } else {
            cell.classList.add('heat-best');
          }

          if (Math.abs(match.total - minTotal) <= 0.01) {
            cell.classList.add('is-best');
          }

          if (match.venueKey === normalizedSelectedVenue && match.packageKey === normalizedSelectedPackage) {
            cell.classList.add('is-active');
            rowHasActive = true;
            activeCellSummary = `${match.venueName} + ${match.packageName} (${formatCurrency(match.total)})`;
          }
        } else {
          cell.classList.add('is-empty');
          cell.textContent = '—';
        }
        row.appendChild(cell);
      });

      if (rowHasActive) {
        row.classList.add('has-active');
      }

      compareTableBody.appendChild(row);
    });

    if (compareSummary) {
      const primaryGuests = venues.find((item) => item.guests)?.guests || Math.max(0, Math.round(guestCount || 0));
      const guestLabel = primaryGuests
        ? `${primaryGuests.toLocaleString()} guest${primaryGuests === 1 ? '' : 's'}`
        : 'default tiers';
      const summaryParts = [
        `Showing ${venues.length} venue${venues.length === 1 ? '' : 's'} × ${packages.length} package${packages.length === 1 ? '' : 's'} for ${guestLabel}.`,
      ];
      if (Number.isFinite(bestEntry?.total)) {
        summaryParts.push(`Best value: ${bestEntry.venueName} + ${bestEntry.packageName} (${formatCurrency(bestEntry.total)}).`);
      }
      if (normalizedSelectedVenue && normalizedSelectedPackage && activeCellSummary) {
        summaryParts.push(`Your current selection (${activeCellSummary}) is outlined in purple.`);
      }
      const hasPercentAdjustments = comparisons.some((entry) => Math.abs(entry.percentAdjustment) > 0.01);
      const hasFlatAdjustments = comparisons.some((entry) => Math.abs(entry.flatAdjustment) > 0.01);
      if (weekdayLabel && hasPercentAdjustments) {
        summaryParts.push(`Weekend adjustments reflect ${weekdayLabel.toLowerCase()} events.`);
      }
      if (weekdayLabel && hasFlatAdjustments) {
        summaryParts.push('Venue flat rules are applied per day.');
      }
      compareSummary.textContent = summaryParts.join(' ');
    }

    function getHeatClass(relative) {
      if (!Number.isFinite(relative) || relative <= 0) {
        return 'heat-best';
      }
      if (relative <= 0.2) {
        return 'heat-good';
      }
      if (relative <= 0.45) {
        return 'heat-mid';
      }
      if (relative <= 0.7) {
        return 'heat-warm';
      }
      return 'heat-hot';
    }
  }

  function buildPackageComparisons(guestCount, eventDate) {
    const normalizedGuests = Math.max(0, Math.round(guestCount || 0));
    const percentRate = workbookModel ? getPercentDiscount(eventDate) : 0;
    const effectivePercent = Number.isFinite(percentRate) ? percentRate : 0;
    const rows = [];
    const venues = venueData.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const packages = packageData.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    venues.forEach((venue) => {
      packages.forEach((pkg) => {
        if (!packageMatchesVenue(pkg, venue.id)) {
          return;
        }
        const pricing = getPackagePrice(pkg, normalizedGuests, venue.id);
        const basePrice = Number.isFinite(pricing.total) ? pricing.total : 0;
        if (!Number.isFinite(basePrice) || Math.abs(basePrice) < 0.01) {
          return;
        }
        const percentAdjustment = effectivePercent ? basePrice * effectivePercent : 0;
        const flatAdjustment = workbookModel ? getFlatDiscount(venue.id, eventDate) : 0;
        const total = basePrice + percentAdjustment + flatAdjustment;
        rows.push({
          venueKey: normalizeId(venue.id),
          venueName: venue.name || venue.id,
          packageKey: normalizeId(pkg.id),
          packageName: pkg.name || pkg.id,
          tierId: pricing.tierId || '',
          tierLabel: pricing.tierLabel || '',
          guestsUsed: pricing.guestsUsed || normalizedGuests || 0,
          basePrice,
          percentAdjustment,
          flatAdjustment,
          total,
        });
      });
    });

    rows.sort((a, b) => {
      const totalDiff = a.total - b.total;
      if (Math.abs(totalDiff) > 0.01) return totalDiff;
      const baseDiff = a.basePrice - b.basePrice;
      if (Math.abs(baseDiff) > 0.01) return baseDiff;
      const venueCompare = (a.venueName || '').localeCompare(b.venueName || '');
      if (venueCompare) return venueCompare;
      return (a.packageName || '').localeCompare(b.packageName || '');
    });

    rows.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return rows;
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

  function buildPackageOptionLabel(pkg, guestCount, venueId) {
    const preview = getPackagePrice(pkg, guestCount, venueId);
    const guestsLabel = preview.guestsUsed
      ? `${preview.guestsUsed.toLocaleString()} guests`
      : guestCount
      ? `${guestCount.toLocaleString()} guests`
      : 'Guest count pending';
    const priceLabel = preview.chargeUnit === CHARGE_UNIT.PER_PERSON || preview.basis === BASIS.PER_GUEST
      ? `${formatCurrency(preview.unitPrice)} per guest`
      : formatCurrency(preview.total);
    const tierLabel = preview.tierLabel ? ` — ${preview.tierLabel}` : '';
    return `${pkg.name} — ${guestsLabel} — ${priceLabel}${tierLabel}`;
  }

  function buildAddonOptionLabel(addon, guestCount, venueId) {
    const preview = getAddonPrice(addon, guestCount, venueId);
    let priceLabel;
    if (preview.chargeUnit === CHARGE_UNIT.PER_PERSON || preview.basis === BASIS.PER_GUEST) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per guest`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_CHILD) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per child`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_HOUR) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per hour`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_UNIT) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per unit`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_SQM) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per sqm`;
    } else {
      priceLabel = formatCurrency(preview.total || preview.unitPrice);
    }
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
    if (pricing.tierLabel) {
      details.push(pricing.tierLabel);
    } else if (pricing.tier?.label) {
      details.push(pricing.tier.label);
    } else if (pricing.tierId) {
      details.push(`Tier ${pricing.tierId}`);
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
    if (pricing.guestsUsed && (pricing.chargeUnit === CHARGE_UNIT.PER_PERSON || pricing.basis === BASIS.PER_GUEST)) {
      details.push(`${pricing.guestsUsed.toLocaleString()} guests`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_CHILD && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} children`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_HOUR && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} hours`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_UNIT && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} units`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_SQM && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} sqm`);
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

  function getSelectedVenueId() {
    if (!state.refs?.venueSelect) return '';
    const value = state.refs.venueSelect.value;
    return value ? normalizeId(value) : '';
  }

  function getWorkbookEventDate() {
    if (workbookModel?.eventDate instanceof Date && !Number.isNaN(workbookModel.eventDate.valueOf())) {
      return workbookModel.eventDate;
    }
    return new Date();
  }

  function getPercentDiscount(eventDate) {
    const referenceDate = eventDate instanceof Date && !Number.isNaN(eventDate.valueOf())
      ? eventDate
      : new Date();
    const weekday = getIsoWeekday(referenceDate);
    return weekday === 5 || weekday === 7 ? WEEKEND_PERCENT_DISCOUNT : 0;
  }

  function getFlatDiscount(venueId, eventDate) {
    if (!workbookModel) {
      return 0;
    }
    const referenceDate = eventDate instanceof Date && !Number.isNaN(eventDate.valueOf())
      ? eventDate
      : new Date();
    const weekday = getIsoWeekday(referenceDate);
    const key = `${normalizeId(venueId)}|${weekday}`;
    return workbookModel.flatDiscounts.get(key) || 0;
  }

  function getIsoWeekday(date) {
    const jsDay = date.getDay();
    return jsDay === 0 ? 7 : jsDay;
  }

  function describeWeekday(value) {
    const labels = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return labels[value] || `Day ${value}`;
  }

  function packageMatchesVenue(pkg, venueId) {
    if (!venueId) {
      return true;
    }
    const normalizedVenueId = normalizeId(venueId);
    if (workbookModel && pkg.sourceType === 'database') {
      return pkg.availableVenueIds?.some((id) => normalizeId(id) === normalizedVenueId);
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

  function getPackagePrice(pkg, guests, venueId = '') {
    if (workbookModel && pkg?.sourceType === 'database' && venueId) {
      return computeDatabasePackagePrice(pkg, guests, venueId);
    }

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
      tierId: tier?.id || null,
      tierLabel: tier?.label || null,
      chargeUnit: basis === BASIS.PER_GUEST ? CHARGE_UNIT.PER_PERSON : CHARGE_UNIT.PER_EVENT,
    };
  }

  function computeDatabasePackagePrice(pkg, guests, venueId) {
    const normalizedVenueId = normalizeId(venueId);
    const guestCount = Math.max(0, Math.round(guests || 0));
    const fallbackGuests = pkg.defaultGuests || workbookModel?.defaultGuests || guestCount;
    const guestsUsed = guestCount > 0 ? guestCount : fallbackGuests || 0;
    const tierId = resolveTierIdForGuests(normalizedVenueId, guestsUsed);
    const tierKey = normaliseTierId(tierId);
    const pricingKey = buildPricingKey(normalizedVenueId, pkg.id, tierKey);
    const pricingEntry = workbookModel.pricingByKey.get(pricingKey);
    let basePrice = pricingEntry?.basePrice ?? 0;

    if (pkg.id === normalizeId(SPECIAL_PACKAGE_SIN_ALIMENTOS)) {
      const fallbackKey = buildPricingKey(normalizedVenueId, SPECIAL_REFERENCE_PACKAGE_TAQUIZA, tierKey);
      const fallbackEntry = workbookModel.pricingByKey.get(fallbackKey);
      if (fallbackEntry) {
        basePrice = fallbackEntry.basePrice - (100 * guestsUsed);
      }
    }

    const unitPrice = Number.isFinite(basePrice) ? basePrice : 0;
    const total = unitPrice;
    const tierLabel = tierKey ? `Tier ${tierKey}` : '';

    return {
      unitPrice,
      quantity: 1,
      total,
      basis: BASIS.FLAT,
      chargeUnit: CHARGE_UNIT.PER_EVENT,
      guestsUsed,
      tierId: tierKey || null,
      tierLabel: tierLabel || null,
    };
  }

  function resolveTierIdForGuests(venueId, guests) {
    const guestCount = Math.max(0, Math.round(guests || 0));
    if (!guestCount) {
      return '';
    }
    const normalizedVenueId = normalizeId(venueId);
    if (normalizedVenueId === 'V012' && workbookModel?.tierLookup?.entries?.length) {
      const match = workbookModel.tierLookup.entries.find((entry) => guestCount <= entry.guests)
        || workbookModel.tierLookup.entries[workbookModel.tierLookup.entries.length - 1];
      return match ? match.tierId : '';
    }
    const ceiling = Math.ceil(guestCount / 10) * 10;
    const padded = String(Math.max(0, ceiling)).padStart(3, '0');
    return `G${padded}`;
  }

  function getAddonPrice(addon, guests, venueId = '') {
    if (workbookModel && addon?.sourceType === 'database' && venueId) {
      return computeDatabaseAddonPrice(addon, guests, venueId);
    }

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
      chargeUnit: basis === BASIS.PER_GUEST ? CHARGE_UNIT.PER_PERSON : CHARGE_UNIT.PER_EVENT,
    };
  }

  function computeDatabaseAddonPrice(addon, guests, venueId) {
    const normalizedVenueId = normalizeId(venueId);
    const overrideKey = buildAddonOverrideKey(normalizedVenueId, addon.id);
    const overridePrice = workbookModel.addonOverrides.get(overrideKey);
    const basePrice = Number.isFinite(overridePrice) ? overridePrice : addon.defaultPrice || 0;
    const defaults = addon.defaults || {};
    const guestCount = Math.max(0, Math.round(guests || 0));
    const fallbackQuantity = Number.isFinite(addon.defaultQty) && addon.defaultQty > 0 ? addon.defaultQty : 1;

    let quantity = 1;
    let guestsUsed = guestCount;
    switch (addon.chargeUnit) {
      case CHARGE_UNIT.PER_PERSON: {
        const computed = guestCount > 0 ? guestCount : Number.isFinite(defaults.guests) ? defaults.guests : 0;
        quantity = Math.max(0, computed || 0);
        guestsUsed = quantity;
        break;
      }
      case CHARGE_UNIT.PER_CHILD: {
        const computed = Number.isFinite(defaults.children)
          ? defaults.children
          : Number.isFinite(defaults.guests)
          ? defaults.guests
          : 0;
        quantity = Math.max(0, computed || 0);
        break;
      }
      case CHARGE_UNIT.PER_HOUR: {
        const computed = Number.isFinite(defaults.hours) && defaults.hours > 0 ? defaults.hours : fallbackQuantity;
        quantity = computed;
        break;
      }
      case CHARGE_UNIT.PER_UNIT: {
        const computed = Number.isFinite(defaults.quantity) && defaults.quantity > 0 ? defaults.quantity : fallbackQuantity;
        quantity = computed;
        break;
      }
      case CHARGE_UNIT.PER_SQM: {
        const computed = Number.isFinite(defaults.sqm) && defaults.sqm > 0 ? defaults.sqm : fallbackQuantity;
        quantity = computed;
        break;
      }
      case CHARGE_UNIT.PER_EVENT:
      default: {
        const computed = Number.isFinite(defaults.quantity) && defaults.quantity > 0 ? defaults.quantity : fallbackQuantity;
        quantity = computed;
        break;
      }
    }

    const total = basePrice * (quantity || 0);
    const basis = addon.chargeUnit === CHARGE_UNIT.PER_PERSON ? BASIS.PER_GUEST : BASIS.FLAT;

    return {
      unitPrice: basePrice,
      quantity,
      total,
      basis,
      guestsUsed,
      chargeUnit: addon.chargeUnit || CHARGE_UNIT.PER_EVENT,
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

  function normalizeId(value) {
    return String(value || '')
      .trim()
      .toUpperCase();
  }

  function normaliseTierId(value) {
    if (!value && value !== 0) {
      return '';
    }
    const cleaned = String(value)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    if (!cleaned) {
      return '';
    }
    return cleaned.replace(/(\d)[A-Z]+$/, '$1');
  }

  function buildPricingKey(venueId, packageId, tierId) {
    return `${normalizeId(venueId)}|${normalizeId(packageId)}|${normaliseTierId(tierId)}`;
  }

  function buildAddonOverrideKey(venueId, addOnId) {
    return `${normalizeId(venueId)}|${normalizeId(addOnId)}`;
  }

  function normaliseChargeUnit(value) {
    if (!value && value !== 0) {
      return CHARGE_UNIT.PER_EVENT;
    }
    const normalised = String(value).trim().toLowerCase();
    if (/child/.test(normalised)) {
      return CHARGE_UNIT.PER_CHILD;
    }
    if (/person|guest|pax/.test(normalised)) {
      return CHARGE_UNIT.PER_PERSON;
    }
    if (/hour/.test(normalised)) {
      return CHARGE_UNIT.PER_HOUR;
    }
    if (/unit|pieza|piece/.test(normalised)) {
      return CHARGE_UNIT.PER_UNIT;
    }
    if (/sqm|m2|square/.test(normalised)) {
      return CHARGE_UNIT.PER_SQM;
    }
    if (/event|flat|once/.test(normalised)) {
      return CHARGE_UNIT.PER_EVENT;
    }
    return CHARGE_UNIT.PER_EVENT;
  }

  function sanitizeQuantity(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    return value >= 0 ? value : null;
  }

  function parseExcelDate(value) {
    if (!value && value !== 0) {
      return null;
    }
    if (value instanceof Date && !Number.isNaN(value.valueOf())) {
      return value;
    }
    if (typeof value === 'number' && XLSX && XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) {
        return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      }
    }
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? null : date;
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
