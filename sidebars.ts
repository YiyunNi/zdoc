import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Generated sidebar files are produced by `docusaurus fetch-lark-docs`.
// Run `docusaurus fetch-lark-docs --manual <name> --pubTarget zilliz` to regenerate.
// To customise without regenerating, edit the corresponding file in config/sidebar-overrides/.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryRequire(path: string): any[] {
  try { return require(path) } catch { return [] }
}

const sidebars: SidebarsConfig = {
  // Cloud / BYOC guides — generated from Feishu wiki
  default: tryRequire('./config/generated/guides.sidebar'),

  // SDK reference sidebars — generated from Feishu drive/wiki sources
  pythonSidebar: tryRequire('./config/generated/python.sidebar'),
  javaSidebar:   tryRequire('./config/generated/java.sidebar'),
  nodeSidebar:   tryRequire('./config/generated/node.sidebar'),
  goSidebar:     tryRequire('./config/generated/go.sidebar'),
};

export default sidebars;
