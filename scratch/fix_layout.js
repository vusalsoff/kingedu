const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.js', 'utf8');

// Replace minmax(Xpx, 1fr) with minmax(min(100%, Xpx), 1fr)
code = code.replace(/minmax\((\d+px),\s*1fr\)/g, 'minmax(min(100%, $1), 1fr)');

// Replace the padding on the main content wrapper
code = code.replace(/padding: "2\.5rem", flex: 1/g, 'padding: "clamp(1rem, 4vw, 2.5rem)", flex: 1, width: "100%", boxSizing: "border-box"');

// Fix main tag to have width: 100% and overflowX hidden just in case
code = code.replace(/<main style=\{\{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflowY: "auto" \}\}>/, '<main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflowY: "auto", overflowX: "hidden", width: "100%" }}>');

fs.writeFileSync('src/app/admin/page.js', code);
console.log("Replaced successfully!");
