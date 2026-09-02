// Renders the HTML files produced by md_to_html.py to A4 PDFs via headless Chromium.
// Usage: node tools/html_to_pdf.js <out-dir> <name> [<name> ...]
const {chromium} = require('playwright');
(async () => {
  const [dir, ...names] = process.argv.slice(2);
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  for (const n of names) {
    await p.goto('file://' + dir + '/' + n + '.html', {waitUntil:'load'});
    await p.pdf({path: dir + '/' + n + '.pdf', format:'A4', printBackground:true,
      margin:{top:'20mm', bottom:'18mm', left:'18mm', right:'18mm'}});
    console.log('rendered', n + '.pdf');
  }
  await b.close();
})();
