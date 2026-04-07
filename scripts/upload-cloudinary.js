const fs = require("fs");
const path = require("path");

async function main() {
  const folder = "girls";
  const dir = path.join(process.cwd(), "public", folder);

  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } =
    process.env;

  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_NAME) {
    console.error("Missing Cloudinary env vars (CLOUDINARY_*).");
    process.exit(1);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);

  const results = [];

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const form = new FormData();
    const buffer = await fs.promises.readFile(filePath);

    form.append("file", new Blob([buffer]), filename);
    form.append("folder", folder);
    form.append("public_id", path.parse(filename).name);

    const auth = Buffer.from(
      `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`,
      "utf8"
    ).toString("base64");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed for ${filename}: ${res.status} ${text}`);
    }

    const json = await res.json();
    const record = {
      filename,
      public_id: json.public_id,
      secure_url: json.secure_url,
      format: json.format,
    };

    results.push(record);
    console.log(`${filename} -> ${json.secure_url}`);
  }

  const outPath = path.join(process.cwd(), "data", "cloudinary-girls.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved mapping to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
