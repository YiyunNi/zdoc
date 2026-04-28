const RefGen = require('./refGen');
const fs = require('node:fs')


module.exports = function (context, options) {
    return {
        name: "fetch-apifox-docs",
        extendCli(cli) {
            cli
                .command('fetch-apifox-docs')
                .option('-s, --specifications <specifications>', 'Specifications of the API')
                .option('-l, --lang <lang>', 'Language of the API Reference', 'en-US')
                .option('-o, --output_path <target_path>', 'Target path of the API Reference', 'reference/api/restful/restful')
                .option('-i, --strings <strings>', 'Localization strings for Chinese docs')
                .option('-t, --target <string>', 'Publication target of the API Reference', 'zilliz')
                .option('-sb, --sidebarPath <sidebarPath>', 'Path to write the generated sidebar file', 'config/generated/restful.sidebar.js')
                .action((opts) => {
                    let lang = opts.lang
                    let target = opts.target
                    let target_path = opts.output_path
                    let specifications;
                    let strings;

                    console.log('Fetching docs from Apifox...')

                    if (opts.specifications === undefined) {
                        console.log('Please provide specifications')
                        return
                    } else {
                        specifications = JSON.parse(fs.readFileSync(opts.specifications, 'utf-8'))
                    }

                    if (opts.lang === 'zh-CN' && opts.strings === undefined) {
                        console.log('Please provide the localization strings for Chinese docs')
                        return
                    } 

                    if (opts.lang === 'zh-CN') {
                        strings = fs.readFileSync(opts.strings, 'utf-8').split('\n')
                    }

                    const refGen = new RefGen({
                        specifications,
                        lang,
                        target,
                        target_path,
                        strings,
                    })

                    if (!fs.existsSync(target_path)) {
                        fs.mkdirSync(target_path, { recursive: true })
                    } else {
                        const folders = fs.readdirSync(target_path, { recursive: true }).filter(f => fs.statSync(target_path + '/' + f).isDirectory())
                        for (let folder of folders.filter(f => !f.endsWith('v1') && !f.endsWith('v2'))) {
                            fs.rmSync(target_path + '/' + folder, { recursive: true, force: true })
                        }
                    }

                    refGen.make_groups()
                    refGen.write_refs()

                    if (opts.sidebarPath) {
                        const contentRoot = opts.output_path.split('/')[0]
                        const sidebarItems = refGen.generate_sidebar(contentRoot)
                        const sidebarDir = require('node:path').dirname(opts.sidebarPath)
                        if (!fs.existsSync(sidebarDir)) fs.mkdirSync(sidebarDir, { recursive: true })
                        fs.writeFileSync(opts.sidebarPath, `module.exports = ${JSON.stringify(sidebarItems, null, 2)}\n`)
                        console.log(`Sidebar written to ${opts.sidebarPath}`)
                    }
                })
            }
        }
    }