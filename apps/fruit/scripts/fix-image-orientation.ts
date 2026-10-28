// Writes upright copies of the photos listed in src/data/image-orientation-fixes.json to
// public/archive-fixes/ (full size plus the three thumbnail widths of copy-images.ts). Most of
// them carry a stale EXIF orientation tag on pixels that are already upright, so browsers and
// sharp's .rotate() turned them sideways; a few were simply photographed sideways. The asset URL
// helpers (src/lib/assetUrls.ts) serve these copies instead of the bucket's.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";
import fixes from "../src/data/image-orientation-fixes.json" with { type: "json" };

// The bucket the archive images are published to (the default of src/lib/assetUrls.ts).
const s3AssetBaseUrl = "https://objects.janpeterdhalle.com/wilhalla-vake-blog";
const outRoot = resolve("public/archive-fixes");
const thumbs = [
  ["archive-thumbs", 480, 72],
  ["archive-thumbs-240", 240, 68],
  ["archive-thumbs-96", 96, 62],
] as const;

for (const [assetPath, { rotate }] of Object.entries(fixes)) {
  const response = await fetch(`${s3AssetBaseUrl}${encodeURI(assetPath)}`);
  if (!response.ok) throw new Error(`${assetPath}: HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  // No .rotate() without an angle: that would apply the EXIF tag this script works around.
  // sharp drops the metadata on output, so the copies carry no orientation tag at all.
  const upright = await sharp(source)
    .rotate(rotate)
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  const relative = assetPath.replace("/archive-images/", "");
  const full = join(outRoot, "archive-images", relative);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, upright);
  for (const [dir, width, quality] of thumbs) {
    const target = join(outRoot, dir, relative).replace(/\.[^./]+$/, ".webp");
    await mkdir(dirname(target), { recursive: true });
    await sharp(upright)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(target);
  }
  console.log(`fixed ${assetPath}`);
}
