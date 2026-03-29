/**
 * Docusaurus Plugin: SDK Guide Generator
 *
 * Generates per-SDK guide pages from Cloud Guide templates at build time.
 * Must be registered BEFORE the reference docs plugin in docusaurus.config.ts
 * so that generated files exist when the docs plugin scans for content.
 */

'use strict';

const { generateAll } = require('./generate');

module.exports = function sdkGuideGeneratorPlugin(context, options) {
  return {
    name: 'sdk-guide-generator',

    async loadContent() {
      const result = generateAll(context.siteDir, { verbose: true });
      return result;
    },

    async contentLoaded({ content }) {
      // content is the result from loadContent()
      // Log summary if there were warnings
      if (content && content.warnings && content.warnings.length > 0) {
        console.warn(
          `[sdk-guide-generator] Completed with ${content.warnings.length} warning(s)`,
        );
      }
    },
  };
};
