import fs from "fs";
const p = "prisma/schema.prisma";
if (!fs.existsSync(p)) {
  console.error("Missing", p);
  process.exit(1);
}
let b = fs.readFileSync(p);
if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) {
  fs.writeFileSync(p, b.slice(3)); // write without BOM
  console.log("Stripped BOM from", p);
} else {
  console.log("No BOM found in", p);
}
