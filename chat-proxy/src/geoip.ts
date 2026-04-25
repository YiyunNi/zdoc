import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

let reader: any = null;
let initPromise: Promise<void> | null = null;

async function initGeoIP(): Promise<void> {
  if (reader) return;
  try {
    const maxmind = await import('maxmind');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const dbPath = join(__dirname, '..', 'data', 'GeoLite2-City.mmdb');
    if (existsSync(dbPath)) {
      reader = await maxmind.open(dbPath);
      console.log('[GeoIP] GeoLite2 City DB loaded');
    } else {
      console.log('[GeoIP] GeoLite2 City DB not found — geolocation disabled');
    }
  } catch {
    console.log('[GeoIP] maxmind not available — geolocation disabled');
  }
}

// Init lazily on first import
initPromise = initGeoIP().catch(() => {});

export async function lookupGeo(ip: string): Promise<{ country: string; city: string } | null> {
  if (initPromise) { await initPromise; initPromise = null; }
  if (!reader || !ip) return null;
  try {
    const result = reader.get(ip);
    if (!result) return null;
    return {
      country: result.country?.iso_code || '',
      city: result.city?.names?.en || '',
    };
  } catch {
    return null;
  }
}
