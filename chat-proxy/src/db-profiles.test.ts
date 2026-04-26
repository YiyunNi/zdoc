import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  initDb,
  closeDb,
  getPool,
  upsertProviderProfile,
  listProviderProfiles,
  getProviderProfile,
  deleteProviderProfile,
  getProviderProfileForRuntimeKey,
  upsertOAuthProfile,
  listOAuthProfiles,
  getActiveOAuthProfile,
  setOAuthProfileActive,
  deleteOAuthProfile,
  setRuntimeConfigValue,
  getRuntimeConfigAll,
  getRuntimeConfigValue,
} from './db.js';

const hasDb = !!process.env.DATABASE_URL;

beforeAll(async () => {
  if (!hasDb) return;
  await initDb();
});

afterAll(async () => {
  if (!hasDb) return;
  await closeDb();
});

// Helper to clean tables between tests
async function cleanTables(): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM runtime_config');
  await pool.query('DELETE FROM oauth_profiles');
  await pool.query('DELETE FROM provider_profiles');
}

describe.skipIf(!hasDb)('Provider profiles', () => {
  it('upsert + list returns masked credentials', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'test-openai',
      provider_type: 'openai-compatible',
      base_url: 'https://api.openai.com/v1',
      region: null,
      credentials: { api_key: 'sk-test-secret-12345' },
      notes: 'Test profile',
    });

    const profiles = await listProviderProfiles();
    expect(profiles).toHaveLength(1);
    const p = profiles[0];
    expect(p.name).toBe('test-openai');
    expect(p.provider_type).toBe('openai-compatible');
    expect(p.base_url).toBe('https://api.openai.com/v1');
    expect(p.region).toBeNull();
    expect(p.credentials).toEqual({ api_key: '***' });
    expect(p.notes).toBe('Test profile');
    expect(p.created_at).toBeTruthy();
    expect(p.updated_at).toBeTruthy();
  });

  it('getProviderProfile decrypts credentials', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'test-openai',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-test-secret-12345' },
    });

    const profile = await getProviderProfile('test-openai');
    expect(profile).not.toBeNull();
    expect(profile!.name).toBe('test-openai');
    expect(profile!.credentials).toEqual({ api_key: 'sk-test-secret-12345' });
  });

  it('upsert updates existing profile', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'test-openai',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-old-key' },
    });

    await upsertProviderProfile({
      name: 'test-openai',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-new-key' },
      notes: 'Updated',
    });

    const profile = await getProviderProfile('test-openai');
    expect(profile!.credentials).toEqual({ api_key: 'sk-new-key' });
    expect(profile!.notes).toBe('Updated');
  });

  it('delete removes profile', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'to-delete',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-delete-me' },
    });

    await deleteProviderProfile('to-delete');

    const profile = await getProviderProfile('to-delete');
    expect(profile).toBeNull();

    const all = await listProviderProfiles();
    expect(all).toHaveLength(0);
  });

  it('getProviderProfileForRuntimeKey returns decrypted profile when profile_name set', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'my-provider',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-for-runtime' },
    });

    await setRuntimeConfigValue('test-key', 'openai-compatible', 'gpt-4', 'my-provider');

    const profile = await getProviderProfileForRuntimeKey('test-key');
    expect(profile).not.toBeNull();
    expect(profile!.name).toBe('my-provider');
    expect(profile!.credentials).toEqual({ api_key: 'sk-for-runtime' });
  });

  it('getProviderProfileForRuntimeKey returns null when no profile_name', async () => {
    await cleanTables();

    await setRuntimeConfigValue('no-profile-key', 'openai-compatible', 'gpt-4');

    const profile = await getProviderProfileForRuntimeKey('no-profile-key');
    expect(profile).toBeNull();
  });

  it('handles bedrock provider type with session_token', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'test-bedrock',
      provider_type: 'bedrock',
      region: 'us-east-1',
      credentials: {
        access_key_id: 'AKIA...',
        secret_access_key: 'wJalrXU...',
        session_token: 'token123',
      },
    });

    const listed = await listProviderProfiles();
    expect(listed[0].credentials).toEqual({
      access_key_id: '***',
      secret_access_key: '***',
      session_token: '***',
    });

    const decrypted = await getProviderProfile('test-bedrock');
    expect(decrypted!.credentials).toEqual({
      access_key_id: 'AKIA...',
      secret_access_key: 'wJalrXU...',
      session_token: 'token123',
    });
  });
});

describe.skipIf(!hasDb)('OAuth profiles', () => {
  it('upsert + list returns masked credentials', async () => {
    await cleanTables();

    await upsertOAuthProfile({
      name: 'test-feishu',
      provider_type: 'feishu',
      host: 'https://open.feishu.cn',
      redirect_uri: 'https://example.com/callback',
      app_id: 'cli_test123',
      credentials: { app_secret: 'super-secret-value' },
      notes: 'Test OAuth profile',
    });

    const profiles = await listOAuthProfiles();
    expect(profiles).toHaveLength(1);
    const p = profiles[0];
    expect(p.name).toBe('test-feishu');
    expect(p.provider_type).toBe('feishu');
    expect(p.is_active).toBe(false);
    expect(p.host).toBe('https://open.feishu.cn');
    expect(p.redirect_uri).toBe('https://example.com/callback');
    expect(p.app_id).toBe('cli_test123');
    expect(p.credentials).toEqual({ app_secret: '***' });
    expect(p.notes).toBe('Test OAuth profile');
  });

  it('getActiveOAuthProfile returns null when no active profile', async () => {
    await cleanTables();

    await upsertOAuthProfile({
      name: 'inactive-feishu',
      provider_type: 'feishu',
      app_id: 'cli_inactive',
      credentials: { app_secret: 'secret' },
    });

    const profile = await getActiveOAuthProfile('feishu');
    expect(profile).toBeNull();
  });

  it('setOAuthProfileActive activates profile and getActiveOAuthProfile returns decrypted', async () => {
    await cleanTables();

    await upsertOAuthProfile({
      name: 'test-feishu',
      provider_type: 'feishu',
      app_id: 'cli_test123',
      credentials: { app_secret: 'super-secret-value' },
      is_active: false,
    });

    await setOAuthProfileActive('test-feishu');

    const profile = await getActiveOAuthProfile('feishu');
    expect(profile).not.toBeNull();
    expect(profile!.name).toBe('test-feishu');
    expect(profile!.credentials).toEqual({ app_secret: 'super-secret-value' });
    expect(profile!.is_active).toBe(true);
  });

  it('setOAuthProfileActive flips active from A to B', async () => {
    await cleanTables();

    await upsertOAuthProfile({
      name: 'profile-a',
      provider_type: 'feishu',
      app_id: 'cli_a',
      credentials: { app_secret: 'secret-a' },
    });

    await upsertOAuthProfile({
      name: 'profile-b',
      provider_type: 'feishu',
      app_id: 'cli_b',
      credentials: { app_secret: 'secret-b' },
    });

    // Activate A first
    await setOAuthProfileActive('profile-a');
    let active = await getActiveOAuthProfile('feishu');
    expect(active!.name).toBe('profile-a');

    // Now activate B
    await setOAuthProfileActive('profile-b');
    active = await getActiveOAuthProfile('feishu');
    expect(active!.name).toBe('profile-b');
    expect(active!.credentials).toEqual({ app_secret: 'secret-b' });

    // Verify A is no longer active
    const allProfiles = await listOAuthProfiles();
    const profileA = allProfiles.find(p => p.name === 'profile-a');
    expect(profileA!.is_active).toBe(false);
    const profileB = allProfiles.find(p => p.name === 'profile-b');
    expect(profileB!.is_active).toBe(true);
  });

  it('delete removes OAuth profile', async () => {
    await cleanTables();

    await upsertOAuthProfile({
      name: 'to-delete',
      provider_type: 'feishu',
      app_id: 'cli_delete',
      credentials: { app_secret: 'delete-me' },
    });

    await deleteOAuthProfile('to-delete');

    const all = await listOAuthProfiles();
    expect(all).toHaveLength(0);
  });
});

describe.skipIf(!hasDb)('Runtime config with profile_name', () => {
  it('setRuntimeConfigValue with profileName round-trips', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'my-provider',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-test' },
    });

    await setRuntimeConfigValue('rt-key', 'openai-compatible', 'gpt-4', 'my-provider');

    const value = await getRuntimeConfigValue('rt-key');
    expect(value).not.toBeNull();
    expect(value!.provider).toBe('openai-compatible');
    expect(value!.model).toBe('gpt-4');
    expect(value!.profileName).toBe('my-provider');
  });

  it('getRuntimeConfigAll returns profileName field', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'prov-all',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-test' },
    });

    await setRuntimeConfigValue('key-a', 'openai-compatible', 'gpt-4', 'prov-all');
    await setRuntimeConfigValue('key-b', 'openai-compatible', 'gpt-3.5-turbo');

    const all = await getRuntimeConfigAll();
    expect(all).toHaveLength(2);

    const keyA = all.find(r => r.key === 'key-a');
    expect(keyA!.profileName).toBe('prov-all');

    const keyB = all.find(r => r.key === 'key-b');
    expect(keyB!.profileName).toBeNull();
  });

  it('FK nullifies profile_name when provider profile is deleted', async () => {
    await cleanTables();

    await upsertProviderProfile({
      name: 'temp-provider',
      provider_type: 'openai-compatible',
      credentials: { api_key: 'sk-temp' },
    });

    await setRuntimeConfigValue('fk-key', 'openai-compatible', 'gpt-4', 'temp-provider');

    // Delete the provider profile
    await deleteProviderProfile('temp-provider');

    // The runtime_config row should still exist but profile_name should be null
    const value = await getRuntimeConfigValue('fk-key');
    expect(value).not.toBeNull();
    expect(value!.profileName).toBeNull();
  });
});
