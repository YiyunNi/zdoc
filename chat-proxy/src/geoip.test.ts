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
});
