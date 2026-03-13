const nunjucks = require("nunjucks")
const fs = require('node:fs')
const path = require('node:path')

const TEMPLATES_DIR = path.join(__dirname, 'templates')
const META_DIR = path.join(__dirname, 'meta')

class refGen {
  constructor(options) {
    this.options = options
    this.options.parents = []

    for ( const x of Object.keys(this.options.specifications.tags)) {
      this.options.parents.push(this.options.specifications.tags[x].name)
    }
  }

  async write_refs() {
    const { lang, target, parents, specifications } = this.options

    const env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(TEMPLATES_DIR),
      {
        autoescape: false,
      }
    )

    const template = env.getTemplate("reference.mdx")
    var idx = 0
    for (const page_url of Object.keys(specifications.paths)) {
      for (const method of Object.keys(specifications.paths[page_url])) {
        const specification = this.resolveRefs(specifications.paths[page_url][method], specifications)

        if (specification?.["x-include-target"] && !specification["x-include-target"].includes(target)) {
          continue
        }
        
        const sidebar_position = idx; idx++;

        const page_title = lang === "zh-CN" ? specification["x-i18n"][lang].summary : specification.summary
        const page_excerpt = this.__filter_content(lang === "zh-CN" ? specification["x-i18n"][lang].description : specification.description, target).split('<')[0]
        var page_parent = parents.filter(x => x === specification.tags[0])[0].replace("&", "and").split(' ').join('-').replace(/\(|\)|,/g, '').toLowerCase()
        if (target === 'milvus') {
          const descriptions = JSON.parse(fs.readFileSync(path.join(META_DIR, 'descriptions.json'), 'utf-8'))
          const name = descriptions.filter(x => x.name === page_parent)[0]?.milvus?.name
          if (name) {
            page_parent = name
          }
        }
        const version = page_parent.includes('v2') ? 'v2' : 'v1'
        var slug_suffix = version === 'v2' ? '-v2' : ''
        if (target === 'milvus') {
          slug_suffix = ''
        }
        var upper_folder = this.__get_plane_for_cloud(page_parent)

        if (target === 'milvus') {
          upper_folder = this.__get_plane_for_milvus(page_parent)
        }
        var page_slug = (this.get_slug(page_title, target)) + slug_suffix
        var beta_tag = version === 'v2' ? 'FALSE' : 'NEAR DEPRECATE'

        // add beta tags
        // beta_tag = page_slug.includes('invoice') || page_slug.includes('usage') ? 'PUBLIC' : beta_tag
        beta_tag = page_slug.includes('merge') ? 'PRIVATE' : beta_tag
        const page_method = method.toLowerCase()
        const specs = JSON.stringify(specification)

        const t = template.render({
          page_title: page_title + (version === 'v2' ? ' (V2)' : ' (V1)'),
          page_excerpt,
          page_slug,
          beta_tag,
          page_url,
          page_method,
          specs,
          sidebar_position,
          target,
          lang,
        }).replaceAll(/<br>/g, '<br/>')
        
        fs.writeFileSync(`${this.options.target_path}/${version}/${upper_folder}/${page_parent}/${page_slug}.mdx`, t)
      }
    }
  }  

  make_groups() {
    const { specifications, target, target_path } = this.options
    const env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(TEMPLATES_DIR),
      { autoescape: false }
    )

    const template = env.getTemplate("group.mdx")

    for (const group of Object.keys(specifications.tags)) {
      if (specifications.tags[group]['x-include-target'] && !(specifications.tags[group]['x-include-target']?.includes(target))) continue;

      const slug = specifications.tags[group].name.replace("&", "and").split(' ').join('-').replace(/\(|\)|,/g, '').toLowerCase()
      const version = slug.includes('v2') ? 'v2' : 'v1'
      var upper_folder = slug.startsWith('cloud') || slug.startsWith('cluster') || slug.startsWith('import') || slug.startsWith('pipeline') || slug.includes('backup') || slug.includes('restore') || slug.includes('invoices') || slug.includes('usage') || slug.includes('metrics') || slug.includes('extract') || slug.includes('volume') || slug.includes('project') ? 'control-plane' : 'data-plane'
      if (target === 'milvus') {
        upper_folder = slug.startsWith('cloud') || slug.startsWith('cluster') || slug.startsWith('pipeline') || slug.includes('backup') || slug.includes('restore') || slug.includes('invoices') || slug.includes('usage') || slug.includes('metrics') || slug.includes('extract') || slug.includes('volume') || slug.includes('project') ? 'control-plane' : 'data-plane'
      }

      console.log(slug)
      const group_name = version === 'v2' ? specifications.tags[group].name.slice(0, -5) : specifications.tags[group].name
      const descriptions = JSON.parse(fs.readFileSync(path.join(META_DIR, 'descriptions.json'), 'utf-8'))
      const description = descriptions.filter(x => x.name === slug)[0].description
      const position = specifications.tags.map(x => x.name).indexOf(specifications.tags[group].name)
      var beta_tag = version === 'v2' ? 'FALSE' : 'NEAR DEPRECATE'
      // beta_tag = slug.includes('invoice') || slug.includes('usage') ? 'PUBLIC' : beta_tag
      beta_tag = slug.includes('extract') ? 'PRIVATE' : beta_tag
      const t = template.render({
        group_name: group_name + (version === 'v2' ? ' (V2)' : ' (V1)'),
        position,
        slug,
        beta_tag,
        description
      })

      var folder_path = `${target_path}/${version}/${upper_folder}/${slug}`

      if (target === 'milvus') {
        const name = descriptions.filter(x => x.name === slug)[0]?.milvus?.name
        if (name) {
          folder_path = `${target_path}/${version}/${upper_folder}/${name}`
        }
      }

      // Create folder structure only — no index files for any category level
      fs.mkdirSync(folder_path, { recursive: true })

      // Clean up any stale index files from previous runs
      const staleFiles = [
        `${target_path}/${version}/${version}.mdx`,
        `${target_path}/${version}/${upper_folder}/${upper_folder}.mdx`,
        `${folder_path}/${slug}.mdx`,
      ]
      for (const f of staleFiles) {
        if (fs.existsSync(f)) fs.rmSync(f)
      }
    }
  }

  generate_sidebar(contentRoot) {
    const { target, specifications, target_path } = this.options
    const descriptions = JSON.parse(fs.readFileSync(path.join(META_DIR, 'descriptions.json'), 'utf-8'))
    const stripRoot = str => str.replace(/\\/g, '/').replace(new RegExp(`^${contentRoot}/`), '')

    // Collect groups keyed by version → plane, preserving spec order
    const tree = {}
    for (const group of Object.keys(specifications.tags)) {
      const tag = specifications.tags[group]
      if (tag['x-include-target'] && !tag['x-include-target'].includes(target)) continue

      const slug = tag.name.replace('&', 'and').split(' ').join('-').replace(/\(|\)|,/g, '').toLowerCase()
      const version = slug.includes('v2') ? 'v2' : 'v1'
      const plane = target === 'milvus' ? this.__get_plane_for_milvus(slug) : this.__get_plane_for_cloud(slug)
      const group_label = (version === 'v2' ? tag.name.slice(0, -5) : tag.name) + (version === 'v2' ? ' (V2)' : ' (V1)')
      const position = specifications.tags.map(x => x.name).indexOf(tag.name)

      let folder_slug = slug
      if (target === 'milvus') {
        const name = descriptions.find(x => x.name === slug)?.milvus?.name
        if (name) folder_slug = name
      }

      const groupDocId = stripRoot(`${target_path}/${version}/${plane}/${folder_slug}/${folder_slug}`)

      // Collect pages for this group in spec order
      const pages = []
      for (const page_url of Object.keys(specifications.paths)) {
        for (const method of Object.keys(specifications.paths[page_url])) {
          const spec = specifications.paths[page_url][method]
          if (spec?.['x-include-target'] && !spec['x-include-target'].includes(target)) continue
          if (spec.tags[0] !== tag.name) continue

          const page_title = target === 'milvus' && spec['x-i18n'] ? spec['x-i18n']['en-US']?.summary ?? spec.summary : spec.summary
          let page_slug = this.get_slug(page_title, target)
          if (target !== 'milvus') page_slug += version === 'v2' ? '-v2' : ''

          const docId = stripRoot(`${target_path}/${version}/${plane}/${folder_slug}/${page_slug}`)
          pages.push({ type: 'doc', id: docId, label: page_title + (version === 'v2' ? ' (V2)' : ' (V1)') })
        }
      }

      if (!tree[version]) tree[version] = {}
      if (!tree[version][plane]) tree[version][plane] = []
      tree[version][plane].push({ position, label: group_label, docId: groupDocId, pages })
    }

    // Build sidebar items
    const sidebar = []
    for (const version of ['v2', 'v1']) {
      if (!tree[version]) continue
      const planeItems = []

      for (const plane of ['control-plane', 'data-plane']) {
        if (!tree[version][plane]) continue
        const planeLabel = (plane.startsWith('control') ? 'Control Plane' : 'Data Plane') + (version === 'v2' ? ' (V2)' : ' (V1)')
        const groups = tree[version][plane]
          .sort((a, b) => a.position - b.position)
          .map(g => ({ type: 'category', label: g.label, items: g.pages }))

        planeItems.push({ type: 'category', label: planeLabel, items: groups })
      }

      sidebar.push({ type: 'category', label: version.toUpperCase(), items: planeItems })
    }

    return sidebar
  }

  get_slug(page_title, target) {
    console.log(page_title)
    var page_slug = 0
    const { lang } = this.options
    if (lang == 'zh-CN') {
      const titles = JSON.parse(fs.readFileSync(path.join(META_DIR, 'titles.json'), 'utf-8'))
      page_slug = titles[page_title]
    } else {
      page_slug = page_title.replace("&", "and").split(' ').join('-').replace(/\(|\)/g, '').toLowerCase()
    }

    if (target === 'milvus') {
      const ruleSet = JSON.parse(fs.readFileSync(path.join(META_DIR, 'fileNameRuleSet.json'), 'utf-8'))
      var slug = undefined
      for (let rule of ruleSet) {
        switch (rule.match) {
          case 'endsWith':
            if (page_slug.endsWith(rule.path)) {
              slug = rule.name
            }
            break;
          case 'contains':
            if (page_slug.includes(rule.path)) {
              slug = rule.name
            }
            break;
          case 'removeAndCapitalize':
            if (page_slug.includes(rule.path)) {
              slug = page_slug.replace(rule.path, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }
            break;
        }

        if (slug) {
          page_slug = slug;
          break;
        }
      }
    }

    return page_slug
  }

  __filter_content (markdown, targets) {
    const matches = this.__match_filter_tags(markdown)

    if (matches.length > 0) {
        var preText = markdown.slice(0, matches[0].startIndex)
        var matchText = markdown.slice(matches[0].startIndex, matches[0].endIndex)
        var postText = markdown.slice(matches[0].endIndex)
        var isTargetValid = targets.split('.').includes(matches[0].target.trim())
        var startTagLength = `<${matches[0].tag} target="${matches[0].target}">`.length
        var endTagLength = `</${matches[0].tag}>`.length

        if (matches[0].tag == 'include' && isTargetValid || matches[0].tag == 'exclude' && !isTargetValid) {
            matchText = matchText.slice(startTagLength, -endTagLength)
        }

        if (matches[0].tag == 'include' && !isTargetValid || matches[0].tag == 'exclude' &&  isTargetValid) {
            matchText = ""
        }

        markdown = this.__filter_content(preText + matchText + postText, targets)
    }

    return markdown.replace(/(\s*\n){3,}/g, '\n\n')
        .replace(/<br>/g, '<br/>')
        .replace(/(<br\/>){2,}/, "<br/>")
        .replace("<br\/></p>", "</p>")
        .replace(/\n\s*<tr>\n(\s*<td.*><p><\/p><\/td>\n)*\s*<\/tr>/g, '');
  }

  __match_filter_tags(markdown) {
      const startTagRegex = /<(include|exclude) target="(.+?)"/gm
      const endTagRegex = /<\/(include|exclude)>/gm
      const matches = [... markdown.matchAll(startTagRegex)]
      var returns = []

      matches.forEach(match => {
          var tag = match[1]
          var rest = markdown.slice(match.index)
          
          var closeTagRegex = new RegExp(`</${tag}>`, 'gm')
          var closeTagMatch = [... rest.matchAll(closeTagRegex)]
          
          var startIndex = match.index
          var endIndex = 0
          
          for (let i = 0; i < closeTagMatch.length; i++) {
              var t = markdown.slice(startIndex, startIndex+closeTagMatch[i].index+closeTagMatch[i][0].length)
          
              var startCount = t.match(startTagRegex) ? t.match(startTagRegex).length : 0
              var endCount = t.match(endTagRegex) ? t.match(endTagRegex).length : 0
      
              if (startCount === endCount) {
                  endIndex = startIndex + closeTagMatch[i].index + closeTagMatch[i][0].length
                  break
              }
          }
          
          returns.push({
              tag: tag,
              target: match[2],
              startIndex: startIndex,
              endIndex: endIndex
          })           
      })

      return returns
  }

  __get_plane_for_cloud(target) {
    return target.startsWith('cloud') || 
      target.startsWith('cluster') || 
      target.startsWith('import') || 
      target.startsWith('pipeline') || 
      target.includes('backup') || 
      target.includes('restore') || 
      target.includes('invoices') || 
      target.includes('usage') || 
      target.includes('metrics') || 
      target.includes('extract') || 
      target.includes('volume') || 
      target.includes('project') ? 'control-plane' : 'data-plane'    
  }

  __get_plane_for_milvus(target) {
    return target.startsWith('cloud') ||
      target.startsWith('cluster') ||
      target.startsWith('pipeline') ||
      target.includes('backup') ||
      target.includes('restore') ||
      target.includes('invoices') ||
      target.includes('usage') ||
      target.includes('metrics') ||
      target.includes('extract') ||
      target.includes('volume') ||
      target.includes('project') ? 'control-plane' : 'data-plane'
  }

  resolveRefs(obj, spec, visited = new Set()) {
    if (!obj || typeof obj !== 'object') {
      return obj
    }

    if (visited.has(obj)) {
      return obj
    }
    visited.add(obj)

    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveRefs(item, spec, visited))
    }

    if (obj.$ref) {
      const refPath = obj.$ref
      if (refPath.startsWith('#/')) {
        const pathParts = refPath.substring(2).split('/')
        let resolved = spec

        for (const part of pathParts) {
          if (resolved && typeof resolved === 'object' && part in resolved) {
            resolved = resolved[part]
          } else {
            console.warn(`Could not resolve reference: ${refPath}`)
            return obj
          }
        }

        return this.resolveRefs(resolved, spec, new Set())
      }
      return obj
    }

    const resolved = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'description' && typeof value === 'object') {
        // Handle description objects while preserving object structure when needed
        if (value.type && (value.description || value.value)) {
          // Preserve schema objects
          resolved[key] = value
        } else if (typeof value === 'object' && (value.description !== undefined || value.value !== undefined)) {
          // For simple description containers, preserve the object
          resolved[key] = value
        } else if (typeof value === 'object') {
          // For other objects, stringify as last resort
          resolved[key] = JSON.stringify(value)
        } else {
          // For primitive values
          resolved[key] = value
        }
      } else {
        resolved[key] = this.resolveRefs(value, spec, visited)
      }
    }

    return resolved
  }
}

module.exports = refGen