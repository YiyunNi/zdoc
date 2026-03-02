'use strict'

const { run } = require('./translator')

module.exports = function i18nTranslatorPlugin(context) {
  return {
    name: 'i18n-translator',

    extendCli(cli) {
      cli
        .command('translate-i18n')
        .description('Translate docs to configured locales using AI (incremental by default)')
        .option('--locale <locale>', 'Target locale', 'ja-JP')
        .option('--all', 'Force re-translate all files, ignoring cache')
        .option('--dry-run', 'Show what would be translated without writing files')
        .option('--harvest-terms', 'Step 0a: extract candidate terms → proposed.tsv (fast, no LLM)')
        .option('--propose-terms', 'Step 0b: call LLM to fill in translations in proposed.tsv')
        .option('--approve-terms', 'Step 0c: promote high-confidence proposed terms into approved glossary.tsv')
        .option('--file <path>', 'Translate a single file and print result to stdout (use with --dry-run to preview without writing)')
        .option('--clear-cache', 'Clear the translation cache for the given locale before running')
        .option('--audit', 'Check existing translated files for quality issues (no LLM calls)')
        .action(async opts => {
          await run({
            siteDir:      context.siteDir,
            locale:       opts.locale,
            forceAll:     !!opts.all,
            dryRun:       !!opts.dryRun,
            harvestOnly:  !!opts.harvestTerms,
            proposeOnly:  !!opts.proposeTerms,
            approveOnly:  !!opts.approveTerms,
            targetFile:   opts.file || null,
            clearCache:   !!opts.clearCache,
            auditOnly:    !!opts.audit,
          })
        })
    },
  }
}
