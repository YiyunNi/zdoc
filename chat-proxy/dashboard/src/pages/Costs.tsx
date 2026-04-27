import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import TokenBarChart from '../components/TokenBarChart';
import TokenTrendChart from '../components/TokenTrendChart';
import TokenTable from '../components/TokenTable';
import ModelConfig from '../components/ModelConfig';
import CacheConfig from '../components/CacheConfig';
import ActionButtons from '../components/ActionButtons';
import ProviderProfiles from '../components/ProviderProfiles';
import OAuthProfiles from '../components/OAuthProfiles';
import DocGaps from '../components/DocGaps';
import ContentQuality from '../components/ContentQuality';
import AdminUsers from '../components/AdminUsers';
import { useAuth } from '../hooks/useAuth';
import { useInterval } from '../hooks/useInterval';

interface TokenUsageRow {
  model: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCachedInputTokens: number;
  totalTokens: number;
}

export default function Costs(): React.ReactElement {
  const [tab, setTab] = useState<'tokens' | 'settings'>('tokens');
  const [settingsSubTab, setSettingsSubTab] = useState<'models' | 'cache' | 'profiles' | 'gaps' | 'quality' | 'admins'>('models');
  const [byModel, setByModel] = useState<TokenUsageRow[]>([]);
  const [tokenTrends, setTokenTrends] = useState<any[]>([]);
  const [tokenDays, setTokenDays] = useState(7);
  const [config, setConfig] = useState<any>(null);
  const [providerProfiles, setProviderProfiles] = useState<any[]>([]);
  const [oauthProfiles, setOAuthProfiles] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [quality, setQuality] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  async function fetchTokens() {
    try {
      const [byModelRes, trendsRes] = await Promise.all([
        api.getTokenUsageByModel(),
        api.getTokenTrends(tokenDays),
      ]);
      setByModel(byModelRes.byModel || []);
      setTokenTrends(trendsRes || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load token data');
    }
  }

  async function fetchSettings() {
    try {
      const [configRes, profilesRes, oauthRes, gapsRes, qualityRes, adminsRes] = await Promise.all([
        api.getConfig(),
        api.getProviderProfiles(),
        api.getOAuthProfiles(),
        api.getDocGaps(100),
        api.getContentQuality(100),
        api.getAdmins(),
      ]);
      setConfig(configRes);
      setProviderProfiles(profilesRes || []);
      setOAuthProfiles(oauthRes || []);
      setGaps(gapsRes.gaps || []);
      setQuality(qualityRes || []);
      setAdmins(adminsRes.admins || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load settings');
    }
  }

  useEffect(() => {
    setLoading(true);
    setError('');
    if (tab === 'tokens') {
      fetchTokens().finally(() => setLoading(false));
    } else {
      fetchSettings().finally(() => setLoading(false));
    }
  }, [tab, tokenDays]);

  const fetchRef = useRef(fetchTokens);
  fetchRef.current = fetchTokens;
  useInterval(() => {
    if (tab === 'tokens') fetchRef.current();
  }, 10000);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Costs & Settings
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Token usage and runtime configuration</p>
      </div>

      <div style={{ display: 'inline-flex', padding: 4, gap: 2, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border-light)', marginBottom: 20 }}>
        <button
          onClick={() => setTab('tokens')}
          style={{
            padding: '7px 16px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            background: tab === 'tokens' ? 'var(--text)' : 'transparent',
            color: tab === 'tokens' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Token Usage
        </button>
        <button
          onClick={() => setTab('settings')}
          style={{
            padding: '7px 16px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            background: tab === 'settings' ? 'var(--text)' : 'transparent',
            color: tab === 'settings' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Settings
        </button>
      </div>

      {loading && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: 'center', color: 'var(--red)' }}>{error}</div>}

      {!loading && !error && tab === 'tokens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>Tokens by Model</h3>
            <select
              value={tokenDays}
              onChange={e => setTokenDays(Number(e.target.value))}
              style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, border: '1px solid #d8dae0' }}
            >
              <option value={7}>Last 7 days</option>
              <option value={1}>Last 24 hours</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
            <TokenBarChart data={byModel} />
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Token Trends</h3>
            <TokenTrendChart data={tokenTrends} />
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Breakdown</h3>
            <TokenTable data={byModel} />
          </div>
        </div>
      )}

      {!loading && !error && tab === 'settings' && (
        <div>
          <div style={{ display: 'inline-flex', padding: 4, gap: 2, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border-light)', marginBottom: 20, flexWrap: 'wrap' }}>
            {(['models', 'cache', 'profiles', 'gaps', 'quality', 'admins'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSettingsSubTab(st)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  background: settingsSubTab === st ? 'var(--text)' : 'transparent',
                  color: settingsSubTab === st ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
            {settingsSubTab === 'models' && config && (
              <ModelConfig
                config={config.models || []}
                resolved={config.resolved || []}
                isAdmin={isAdmin}
                onChange={refreshSettings}
              />
            )}
            {settingsSubTab === 'cache' && config && (
              <>
                <CacheConfig cache={config.cache || {}} index={config.index || {}} />
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Actions</h4>
                  <ActionButtons isAdmin={isAdmin} />
                </div>
              </>
            )}
            {settingsSubTab === 'profiles' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <ProviderProfiles profiles={providerProfiles} isAdmin={isAdmin} onChange={refreshSettings} />
                <OAuthProfiles profiles={oauthProfiles} isAdmin={isAdmin} onChange={refreshSettings} />
              </div>
            )}
            {settingsSubTab === 'gaps' && <DocGaps gaps={gaps} isAdmin={isAdmin} onChange={refreshSettings} />}
            {settingsSubTab === 'quality' && <ContentQuality issues={quality} />}
            {settingsSubTab === 'admins' && <AdminUsers admins={admins} isAdmin={isAdmin} onChange={refreshSettings} />}
          </div>
        </div>
      )}
    </div>
  );
}
