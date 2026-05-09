import {afterEach, describe, expect, it, vi} from 'vitest';

const originalEnv = {...process.env};

afterEach(() => {
  process.env = {...originalEnv};
  vi.resetModules();
});

describe('geoip helpers', () => {
  it('resolves database path from env override', async () => {
    process.env.GEOLITE2_DB_PATH = '/tmp/custom-country.mmdb';
    const geoip = await import('./geoip.js');

    expect(geoip.resolveGeoIpDbPath()).toBe('/tmp/custom-country.mmdb');
  });

  it('defaults to GeoLite2-Country mmdb under data directory', async () => {
    delete process.env.GEOLITE2_DB_PATH;
    const geoip = await import('./geoip.js');

    expect(geoip.resolveGeoIpDbPath()).toMatch(/data\/GeoLite2-Country\.mmdb$/);
  });

  it('maps maxmind country result into rich metadata with backward compatible fields', async () => {
    const geoip = await import('./geoip.js');

    const mapped = geoip.mapGeoResult({
      country: {
        iso_code: 'US',
        names: {en: 'United States'},
      },
      continent: {
        code: 'NA',
        names: {en: 'North America'},
      },
      city: {
        names: {en: 'San Francisco'},
      },
      registered_country: {
        iso_code: 'US',
        names: {en: 'United States'},
      },
      location: {
        time_zone: 'America/Los_Angeles',
        latitude: 37.7898,
        longitude: -122.3942,
        accuracy_radius: 20,
      },
      postal: {
        code: '94105',
      },
      subdivisions: [
        {
          iso_code: 'CA',
          names: {en: 'California'},
        },
      ],
    });

    expect(mapped).toEqual({
      country: 'US',
      city: 'San Francisco',
      countryName: 'United States',
      continentCode: 'NA',
      continentName: 'North America',
      registeredCountry: 'US',
      registeredCountryName: 'United States',
      timezone: 'America/Los_Angeles',
      postalCode: '94105',
      latitude: 37.7898,
      longitude: -122.3942,
      accuracyRadius: 20,
      subdivisionCodes: ['CA'],
      subdivisionNames: ['California'],
    });
  });

  it('falls back gracefully when optional geo fields are missing', async () => {
    const geoip = await import('./geoip.js');

    const mapped = geoip.mapGeoResult({
      registered_country: {iso_code: 'DE'},
    });

    expect(mapped).toEqual({
      country: 'DE',
      city: '',
      countryName: '',
      continentCode: '',
      continentName: '',
      registeredCountry: 'DE',
      registeredCountryName: '',
      timezone: '',
      postalCode: undefined,
      latitude: undefined,
      longitude: undefined,
      accuracyRadius: undefined,
      subdivisionCodes: [],
      subdivisionNames: [],
    });
  });

  it('returns null for empty IP input', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => true),
    }));

    const get = vi.fn();
    vi.doMock('maxmind', () => ({
      open: vi.fn(async () => ({get})),
    }));

    const geoip = await import('./geoip.js');
    const result = await geoip.lookupGeo('');

    expect(result).toBeNull();
    expect(get).not.toHaveBeenCalled();
  });

  it('returns null when maxmind reader get throws', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => true),
    }));

    vi.doMock('maxmind', () => ({
      open: vi.fn(async () => ({
        get: vi.fn(() => {
          throw new Error('lookup failed');
        }),
      })),
    }));

    const geoip = await import('./geoip.js');

    await expect(geoip.lookupGeo('1.1.1.1')).resolves.toBeNull();
  });

  it('returns null when DB is missing and does not open maxmind reader', async () => {
    const open = vi.fn();

    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => false),
    }));

    vi.doMock('maxmind', () => ({
      open,
    }));

    const geoip = await import('./geoip.js');
    const result = await geoip.lookupGeo('1.1.1.1');

    expect(result).toBeNull();
    expect(open).not.toHaveBeenCalled();
  });

  it('maps and returns geo fields when lookup succeeds', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => true),
    }));

    vi.doMock('maxmind', () => ({
      open: vi.fn(async () => ({
        get: vi.fn(() => ({
          country: {iso_code: 'JP', names: {en: 'Japan'}},
          continent: {code: 'AS', names: {en: 'Asia'}},
          city: {names: {en: 'Tokyo'}},
          registered_country: {iso_code: 'JP', names: {en: 'Japan'}},
          location: {
            time_zone: 'Asia/Tokyo',
            latitude: 35.6762,
            longitude: 139.6503,
            accuracy_radius: 50,
          },
          postal: {code: '100-0001'},
          subdivisions: [{iso_code: '13', names: {en: 'Tokyo'}}],
        })),
      })),
    }));

    const geoip = await import('./geoip.js');
    const result = await geoip.lookupGeo('8.8.8.8');

    expect(result).toEqual({
      country: 'JP',
      city: 'Tokyo',
      countryName: 'Japan',
      continentCode: 'AS',
      continentName: 'Asia',
      registeredCountry: 'JP',
      registeredCountryName: 'Japan',
      timezone: 'Asia/Tokyo',
      postalCode: '100-0001',
      latitude: 35.6762,
      longitude: 139.6503,
      accuracyRadius: 50,
      subdivisionCodes: ['13'],
      subdivisionNames: ['Tokyo'],
    });
  });
});
