import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Generated sidebar file is produced by `docusaurus fetch-lark-docs`.
// Run `docusaurus fetch-lark-docs --manual guides --pubTarget zilliz.paas` to regenerate.
// To customise without regenerating, edit config/sidebar-overrides/guides-byoc.json.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryRequire(path: string): any[] {
  try { return require(path) } catch { return [] }
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const applyOverrides = require('./config/applyOverrides')

const sidebars: SidebarsConfig = {
  default: applyOverrides(
    tryRequire('./config/generated/guides-byoc.sidebar'),
    require.resolve('./config/sidebar-overrides/guides-byoc.json'),
  ),
};

export default sidebars;
