# Quote Export Background

The downloadable quote exports (PDF, DOCX, XLSX) pull their background artwork from `assets/quote-background.svg` at runtime. The app fetches that SVG, converts it to a PNG, and then draws it behind every exported document page.

To replace the artwork with your own design:

1. Save your branded template as an SVG file sized for an A4/Letter page (the current file is 1240×1754px).
2. Overwrite `assets/quote-background.svg` with your design, or update the `QUOTE_EXPORT_BACKGROUND_PATH` constant in `app.js` to point to a different asset path if you prefer another filename.
3. Reload the app (a hard refresh clears the cached SVG/PNG). Afterwards, every new export will use the updated background.

If you keep the filename the same but the exports still show the old artwork, clear the browser cache or open the app in a private window—the background loader caches the SVG and PNG in memory and the browser may also cache the old asset.
