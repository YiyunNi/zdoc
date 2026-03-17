import { defineConfig } from "@inkeep/cxkit-docusaurus";

export const inkeepSettings ={
  baseSettings: {
    primaryBrandColor: "#175fff",
    organizationDisplayName: "Zilliz",
    theme: {
      styles: [
        {
          key: 'custom-styles',
          type: 'link',
          value: "/css/inkeep-overrides.css"
        }
      ]
    },
    transformSource: (source, type) => {
        const tabs = source.tabs || [];

        if (type === 'searchResultItem') {
            console.log('source', source)
            console.log('type', type)
            if (source.url.includes('/docs/byoc')) {
                tabs.push('BYOC')
            } else if (source.url.includes('/docs')) {
                tabs.push('Guides')
            } else if (source.breadcrumbs.includes('Reference')) {
                tabs.push('Reference')
            } else if (source.url.startsWith('https://support.zilliz.com')) {
                tabs.push('Support')
            } else if (source.breadcrumbs.includes('Partners')) {
                tabs.push('Partners')
            } else if (source.breadcrumbs.includes('Event')) {
                tabs.push('Event')
            } else if (source.breadcrumbs.includes('Glossary')) {
                tabs.push('Glossary')
            } 
                
            return {
                ...source,
                title: `${source.title.split('Contact')[0].split(' | ')[0]}`
            }
        }
    }            
  },
  aiChatSettings: {
    toolbarButtonLabels: {
      getHelp: "Get Help",
      clear: "Clear",
      stop: "Stop"
    },
    aiAssistantName: "AI Assistant",
    chatSubjectName: "Zilliz Cloud",
    introMessage: "Hi, I'm the Zilliz Cloud AI Assistant.\nTrained on our technical docs, help articles, and best practices.\nWhat can we help with today?",
    getHelpOptions: [
      {
        name: "Contact Support",
        action: {
          type: "open_link",
          url: "https://support.zilliz.com/hc/en-us",
        },
        icon: {
          builtIn: "IoHelpBuoyOutline"
        },
        isPinnedToToolbar: true
      },
      {
        name: "Contact Sales",
        action: {
          type: "open_link",
          url: "https://zilliz.com/contact-sales?contact_sales_traffic_source=websiteBot"
        },
        icon: {
          builtIn: "IOChatbubblesOutline"
        },
        isPinnedToToolbar: true
      }
    ],
    exampleQuestionsLabel: "EXAMPLE QUESTIONS",
    exampleQuestions: [
      "Create and connect to a cluster",
      "Optimize vector search performance for large datasets",
      "Serverless vs Dedicated",
      "Latest updates of Zilliz Cloud",
      "Change payment method"
    ],
    aiAssistantAvatar: "https://assets.zilliz.com/cloud_ai_assistance_avatar_d9eb0d7763.svg",
    placeholder: "How can I get started?",
    getTools: () => []
  },
  searchSettings: {
    placeholder: 'What are you looking for?',
    tabs: ['All', 'Guides', 'BYOC', 'Reference', 'Support', 'Partners', 'Event', 'Glossary']        
  }
};

export default defineConfig({
  SearchBar: {
    ...inkeepSettings
  },
  ChatButton: {
    ...inkeepSettings
  },
});
