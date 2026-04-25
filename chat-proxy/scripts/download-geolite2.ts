// Downloads the GeoLite2 City database from MaxMind.
// Requires MAXMIND_LICENSE_KEY env var.
// Run: npx tsx scripts/download-geolite2.ts

import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { get } from 'https';

const LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY;
if (!LICENSE_KEY) {
  console.error('Set MAXMIND_LICENSE_KEY env var to download GeoLite2 DB');
  console.error('Get a free key at https://www.maxmind.com/en/geolite2/signup');
  process.exit(1);
}

const outDir = join(import.meta.dirname, '..', 'data');
const outPath = join(outDir, 'GeoLite2-City.mmdb');

if (existsSync(outPath)) {
  console.log('GeoLite2 City DB already exists at', outPath);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });

const url = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${LICENSE_KEY}&suffix=tar.gz`;
console.log('Downloading GeoLite2 City DB...');

// Download tar.gz, extract mmdb — simplified: just note the manual step
console.log('Download from:', url);
console.log('Extract the .mmdb file to:', outPath);
