const RefGen = require('./refGen');
const fs = require('node:fs')
const path = require('node:path')

function loadSpecifications(inputPath) {
    const stat = fs.statSync(inputPath)
    if (stat.isFile()) {
        return JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
    }

    if (!stat.isDirectory()) {
        throw new Error(`Path "${inputPath}" is neither a file nor a directory`)
    }

    const files = fs.readdirSync(inputPath)
        .filter(f => f.endsWith('.json'))
        .sort()

    if (files.length === 0) {
        throw new Error(`No .json files found in directory "${inputPath}"`)
    }

    let spec = null

    for (const file of files) {
        const content = JSON.parse(fs.readFileSync(path.join(inputPath, file), 'utf-8'))

        if (!spec) {
            spec = { ...content }
            continue
        }

        if (content.tags) {
            spec.tags = [...(spec.tags || []), ...content.tags]
        }
        if (content.paths) {
            spec.paths = { ...(spec.paths || {}), ...content.paths }
        }
        if (content.components) {
            spec.components = spec.components || {}
            for (const key of Object.keys(content.components)) {
                spec.components[key] = {
                    ...(spec.components[key] || {}),
                    ...content.components[key]
                }
            }
        }
        if (content.servers) {
            spec.servers = content.servers
        }
    }

    return spec
}

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
                        try {
                            specifications = loadSpecifications(opts.specifications)
                        } catch (err) {
                            console.error(`Failed to read OpenAPI spec from "${opts.specifications}": ${err.message}`)
                            return
                        }
                    }

                    if (opts.lang === 'zh-CN' && opts.strings === undefined) {
                        console.log('Please provide the localization strings for Chinese docs')
                        return
                    }

                    if (opts.lang === 'zh-CN') {
                        try {
                            strings = fs.readFileSync(opts.strings, 'utf-8').split('\n')
                        } catch (err) {
                            console.error(`Failed to read localization strings from "${opts.strings}": ${err.message}`)
                            return
                        }
                    }

                    const refGen = new RefGen({
                        specifications,
                        lang,
                        target,
                        target_path,
                        strings,
                    })

                    const folders = fs.readdirSync(target_path, { recursive: true }).filter(f => fs.statSync(target_path + '/' + f).isDirectory())
                    for (let folder of folders.filter(f => !f.endsWith('v1') && !f.endsWith('v2'))) {
                        fs.rmSync(target_path + '/' + folder, { recursive: true, force: true })
                    }

                    refGen.make_groups()
                    refGen.write_refs()
                })
            }
        }
    }
