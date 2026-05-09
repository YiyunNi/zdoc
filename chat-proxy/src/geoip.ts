import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

type MaxMindNames = {
  en?: string;
};

type MaxMindSubdivision = {
  iso_code?: string;
  names?: MaxMindNames;
};

type MaxMindResult = {
  country?: {iso_code?: string; names?: MaxMindNames};
  registered_country?: {iso_code?: string; names?: MaxMindNames};
  continent?: {code?: string; names?: MaxMindNames};
  city?: {names?: MaxMindNames};
  location?: {
    time_zone?: string;
    latitude?: number;
    longitude?: number;
    accuracy_radius?: number;
  };
  postal?: {code?: string};
  subdivisions?: MaxMindSubdivision[];
};

type MaxMindReader = {
  get(ip: string): MaxMindResult | null;
};

type MaxMindModule = {
  open(dbPath: string): Promise<MaxMindReader>;
};

export type GeoLookup = {
  country: string;
  city: string;
  countryName: string;
  continentCode: string;
  continentName: string;
  registeredCountry: string;
  registeredCountryName: string;
  timezone: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  accuracyRadius?: number;
  subdivisionCodes: string[];
  subdivisionNames: string[];
};

let reader: MaxMindReader | null = null;
let initPromise: Promise<void> | null = null;

export function resolveGeoIpDbPath(): string {
  const override = process.env.GEOLITE2_DB_PATH?.trim();
  if (override) return override;

  const __dirname = dirname(fileURLToPath(import.meta.url));
  return join(__dirname, '..', 'data', 'GeoLite2-Country.mmdb');
}

export function mapGeoResult(result: MaxMindResult): GeoLookup {
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
    postalCode: result?.postal?.code,
    latitude: result?.location?.latitude,
    longitude: result?.location?.longitude,
    accuracyRadius: result?.location?.accuracy_radius,
    subdivisionCodes: Array.isArray(result?.subdivisions)
      ? result.subdivisions.map((s) => s?.iso_code).filter((code): code is string => Boolean(code))
      : [],
    subdivisionNames: Array.isArray(result?.subdivisions)
      ? result.subdivisions.map((s) => s?.names?.en).filter((name): name is string => Boolean(name))
      : [],
  };
}

async function initGeoIP(): Promise<void> {
  if (reader) return;
  try {
    const maxmind = (await import('maxmind')) as MaxMindModule;
    const dbPath = resolveGeoIpDbPath();
    if (existsSync(dbPath)) {
      reader = await maxmind.open(dbPath);
      console.log(`[GeoIP] GeoLite DB loaded (${basename(dbPath)})`);
    } else {
      console.log('[GeoIP] GeoLite DB not found — geolocation disabled');
    }
  } catch {
    console.log('[GeoIP] maxmind not available — geolocation disabled');
  }
}

// Start async initialization at import time; first lookup awaits this once.
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
