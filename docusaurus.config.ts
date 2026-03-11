import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import larkDocsConfig from './config/lark-docs.config';
import 'dotenv/config';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Zilliz Cloud Developer Hub',
  tagline: 'Find what you need to work with Zilliz Cloud',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.zilliz.com',
  baseUrl: '/',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    inkeepApiKey: process.env.INKEEP_API_KEY || '',
    secondaryNavbar: [
      { label: 'Cloud Guides',  href: '/docs',            prefix: '/docs',            icon: 'cloud'     },
      { label: 'BYOC Guides',   href: '/docs/byoc',       prefix: '/docs/byoc',       icon: 'server'    },
      { label: 'API & SDK',     href: '/reference',       prefix: '/reference',       icon: 'code'      },
      { label: 'CLI',           href: '/docs',            prefix: null,               icon: 'terminal'  },
      { label: 'Releases',      href: '/docs',            prefix: null,               icon: 'tag'       },
    ],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'reference',
        path: 'reference',
        routeBasePath: 'reference',
        sidebarPath: './sidebarsReference.ts',
        breadcrumbs: true,
      },
    ],
    ['./plugins/lark-docs', larkDocsConfig],
    './plugins/apifox-docs',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebarsTutorial.ts',
          breadcrumbs: false,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'User Guides (Cloud)',
            },
            byoc: {
              label: 'User Guides (BYOC)',
              path: 'byoc',
              banner: 'none',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&display=swap',
      },
    },
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Zilliz Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://support.zilliz.com/hc/en-us',
          label: 'Support',
          position: 'right',
          className: 'navbar-support-link',
        },
        {
          href: 'https://cloud.zilliz.com/login',
          label: 'Log In',
          position: 'right',
          className: 'navbar-login-link',
        },
        {
          href: 'https://cloud.zilliz.com/signup',
          label: 'Sign Up Free',
          position: 'right',
          className: 'navbar-signup-btn',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© Zilliz ${new Date().getFullYear()} All rights reserved.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.nightOwl,
      additionalLanguages: ['java', 'go', 'bash', 'json'],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
