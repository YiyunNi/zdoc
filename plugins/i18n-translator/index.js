'use strict'

const { run, validateAndRevert } = require('./translator')

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
        .option('--validate-and-revert', 'Revert any translated files that still fail MDX compilation (run after mdx-parse)')
        .option('--report-json <path>', 'Write a JSON report of broken files to <path> (use with --validate-and-revert)')
        .action(async opts => {
          if (opts.validateAndRevert) {
            const path = require('path')
            const { spawnSync } = require('child_process')
            const sources = [
              {
                folder:     path.join(context.siteDir, 'docs/tutorials'),
                destFolder: path.join(context.siteDir, 'i18n', opts.locale, 'docusaurus-plugin-content-docs/current/tutorials'),
              },
              {
                folder:     path.join(context.siteDir, 'versioned_docs/version-byoc/tutorials'),
                destFolder: path.join(context.siteDir, 'i18n', opts.locale, 'docusaurus-plugin-content-docs/version-byoc/tutorials'),
              },
            ]
            const revertedPaths = await validateAndRevert({
              sources,
              siteDir:        context.siteDir,
              locale:         opts.locale,
              dbPath:         path.join(context.siteDir, 'translation.db'),
              reportJsonPath: opts.reportJson || null,
            })
            if (revertedPaths.length > 0 && process.env.APP_ID) {
              const fileList = revertedPaths.map(p => `• ${p}`).join('\n')
              const msg = `⚠️ ${revertedPaths.length} Japanese translation(s) failed MDX validation and were reverted. They will be retried on the next run.\n\n${fileList}`
              spawnSync(
                'npx', ['docusaurus', 'report-to-lark', '-type', 'text', '-m', msg],
                { cwd: context.siteDir, stdio: 'inherit', encoding: 'utf8' }
              )
            }
            return
          }

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
