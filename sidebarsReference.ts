import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Generated sidebar files are produced by `docusaurus fetch-lark-docs`.
// Run `docusaurus fetch-lark-docs --manual <name> --pubTarget zilliz` to regenerate.
// To customise without regenerating, edit the corresponding file in config/sidebar-overrides/.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryRequire(path: string): any[] {
  try { return require(path) } catch { return [] }
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const applyOverrides = require('./config/applyOverrides')

const sidebars: SidebarsConfig = {
  // SDK reference sidebars — generated from Feishu drive/wiki sources
  pythonSidebar:  applyOverrides(tryRequire('./config/generated/python.sidebar'), require.resolve('./config/sidebar-overrides/python.json')),
  javaSidebar:    applyOverrides(tryRequire('./config/generated/java.sidebar'),   require.resolve('./config/sidebar-overrides/java.json')),
  nodeSidebar:    applyOverrides(tryRequire('./config/generated/node.sidebar'),   require.resolve('./config/sidebar-overrides/node.json')),
  goSidebar:      applyOverrides(tryRequire('./config/generated/go.sidebar'),     require.resolve('./config/sidebar-overrides/go.json')),
  // REST API reference sidebar — generated from Apifox specifications
  restfulSidebar: applyOverrides(tryRequire('./config/generated/restful.sidebar'), require.resolve('./config/sidebar-overrides/restful.json')),
};

export default sidebars;
