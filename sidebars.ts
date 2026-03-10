import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Quickstarts',
      customProps: {icon: 'quickstarts'},
      collapsible: true,
      collapsed: false,
      items: [
        'intro',
        'tutorial-basics/create-a-page',
        'tutorial-basics/create-a-document',
      ],
    },
    {
      type: 'category',
      label: 'Data',
      customProps: {icon: 'data'},
      collapsible: true,
      collapsed: true,
      items: [
        'tutorial-basics/markdown-features',
        'tutorial-extras/manage-docs-versions',
      ],
    },
    {
      type: 'category',
      label: 'Infrastructure',
      customProps: {icon: 'infrastructure'},
      collapsible: true,
      collapsed: true,
      items: [
        'tutorial-basics/deploy-your-site',
        'tutorial-extras/translate-your-site',
      ],
    },
    {
      type: 'category',
      label: 'Administration',
      customProps: {icon: 'administration'},
      collapsible: true,
      collapsed: true,
      items: [
        'tutorial-basics/create-a-blog-post',
        'tutorial-basics/congratulations',
      ],
    },
  ],
};

export default sidebars;
