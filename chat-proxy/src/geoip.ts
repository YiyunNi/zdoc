import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

export type GeoLookup = {
  country: string;
  city: string;
  countryName: string;
  continentCode: string;
  continentName: string;
  registeredCountry: string;
  registeredCountryName: string;
  timezone: string;
  subdivisionCodes: string[];
  subdivisionNames: string[];
};

let reader: any = null;
let initPromise: Promise<void> | null = null;

export function resolveGeoIpDbPath(): string {
  const override = process.env.GEOIP_DB_PATH?.trim();
  if (override) return override;

  const __dirname = dirname(fileURLToPath(import.meta.url));
  return join(__dirname, '..', 'data', 'GeoLite2-Country.mmdb');
}

export function mapGeoResult(result: any): GeoLookup {
  const country = result?.country?.iso_code || result?.registered_country?.iso_code || '';
  const city = result?.city?.names?.en || '';

  return {
    country,
    city,
    countryName: result?.country?.names?.en || result?.registered_country?.names?.en || '',
    continentCode: result?.continent?.code || '',
    continentName: result?.continent?.names?.en || '',
    registeredCountry: result?.registered_country?.iso_code || country,
    registeredCountryName: result?.registered_country?.names?.en || '',
    timezone: result?.location?.time_zone || '',
    subdivisionCodes: Array.isArray(result?.subdivisions) ? result.subdivisions.map((s: any) => s?.iso_code).filter(Boolean) : [],
    subdivisionNames: Array.isArray(result?.subdivisions) ? result.subdivisions.map((s: any) => s?.names?.en).filter(Boolean) : [],
  };
}

async function initGeoIP(): Promise<void> {
  if (reader) return;
  try {
    const maxmind = await import('maxmind');
    const dbPath = resolveGeoIpDbPath();
    if (existsSync(dbPath)) {
      reader = await maxmind.open(dbPath);
      console.log(`[GeoIP] GeoLite DB loaded from ${dbPath}`);
    } else {
      console.log(`[GeoIP] GeoLite DB not found at ${dbPath} — geolocation disabled`);
    }
  } catch {
    console.log('[GeoIP] maxmind not available — geolocation disabled');
  }
}

// Init lazily on first import
initPromise = initGeoIP().catch(() => {});

export async function lookupGeo(ip: string): Promise<GeoLookup | null> {
  if (initPromise) {
    await initPromise;
    initPromise = null;
  }
  if (!reader || !ip) return null;

  try {
    const result = reader.get(ip);
    if (!result) return null;
    return mapGeoResult(result);
  } catch {
    return null;
  }
}
