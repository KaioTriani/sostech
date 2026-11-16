// node scripts/tiles.mjs qa/home-390.png 1800  -> corta a foto em partes para revisão
import sharp from "sharp";
const [file, h = "1800"] = process.argv.slice(2);
const img = sharp(file);
const { width, height } = await img.metadata();
const H = Number(h);
let i = 0;
for (let y = 0; y < height; y += H, i++) {
  await sharp(file).extract({ left: 0, top: y, width, height: Math.min(H, height - y) }).resize({ width: Math.min(width, 900) }).jpeg({ quality: 70 }).toFile(file.replace(".png", `-p${i}.jpg`));
}
console.log(i, "partes", width, height);
