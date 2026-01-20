const fs = require('node:fs');
const path = require('node:path');

module.exports = function (context, options) {
  return {
    name: 'embed-markdown',

    async loadContent() {
      // Read all markdown files during build
      const { siteDir = process.cwd() } = context;
      const sources = ['docs', 'reference', 'versioned_docs'];

      const markdownFiles = {};

      for (const sourceDir of sources) {
        const srcPath = path.join(siteDir, sourceDir);

        if (!fs.existsSync(srcPath)) {
          console.log(`[embed-markdown] Source directory not found: ${srcPath}`);
          continue;
        }

        console.log(`[embed-markdown] Processing: ${srcPath}`);

        const readFiles = (dir, relativePath = '') => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relPath = path.join(relativePath, entry.name);

            if (entry.isDirectory()) {
              readFiles(fullPath, relPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
              // Build the URL path for this file (without .md extension for page path)
              let pagePath;
              if (sourceDir === 'docs') {
                pagePath = `/docs/${relativePath ? relativePath + '/' : ''}${entry.name.replace('.md', '')}`;
              } else if (sourceDir === 'reference') {
                pagePath = `/reference/${relativePath ? relativePath + '/' : ''}${entry.name.replace('.md', '')}`;
              } else if (sourceDir === 'versioned_docs') {
                // Handle versioned docs
                const versionMatch = relativePath.match(/^version-([^/]+)(?:\/(.*))?$/);
                if (versionMatch) {
                  const version = versionMatch[1];
                  const restPath = versionMatch[2] || '';
                  const fileName = entry.name.replace('.md', '');
                  pagePath = version === 'current'
                    ? `/docs/${restPath}${fileName}`
                    : `/docs/${version}/${restPath}${fileName}`;
                }
              }

              if (pagePath) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                markdownFiles[pagePath] = content;
                console.log(`[embed-markdown] ${pagePath} -> ${fullPath}`);
              }
            }
          }
        };

        readFiles(srcPath);
      }

      console.log(`[embed-markdown] Loaded ${Object.keys(markdownFiles).length} markdown files`);
      return { markdownFiles };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content.markdownFiles);
      console.log(`[embed-markdown] Set global data with ${Object.keys(content.markdownFiles).length} files`);
    },

    async postBuild({ outDir }) {
      console.log('\n[embed-markdown] Copying markdown files to build directory...');

      const sources = [
        { src: path.join(context.siteDir || process.cwd(), 'docs'), dest: path.join(outDir, 'docs') },
        { src: path.join(context.siteDir || process.cwd(), 'reference'), dest: path.join(outDir, 'reference') },
        {
          src: path.join(context.siteDir || process.cwd(), 'versioned_docs'),
          dest: path.join(outDir, 'versioned_docs')
        },
      ];

      let totalCopied = 0;

      for (const { src, dest } of sources) {
        if (!fs.existsSync(src)) {
          console.log(`[embed-markdown] Source directory not found: ${src}`);
          continue;
        }

        const copyMarkdownFiles = (dir, relativePath = '') => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const destPath = path.join(dest, relativePath, entry.name);

            if (entry.isDirectory()) {
              if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
              }
              copyMarkdownFiles(fullPath, path.join(relativePath, entry.name));
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
              fs.copyFileSync(fullPath, destPath);
              totalCopied++;
              console.log(`[embed-markdown] Copied: ${path.join(relativePath, entry.name)}`);
            }
          }
        };

        copyMarkdownFiles(src);
      }

      console.log(`[embed-markdown] Copied ${totalCopied} markdown files to build directory.\n`);
    },

    configureWebpack(_config, isServer) {
      // Add dev server middleware to serve .md files
      if (!isServer) {
        return {
          devServer: {
            setupMiddlewares: (middlewares, devServer) => {
              devServer.app.get('*.md', (req, res, next) => {
                const urlPath = req.path;
                console.log('[embed-markdown] Dev server serving:', urlPath);

                let fsPath;
                if (urlPath.startsWith('/docs/')) {
                  // Remove /docs/ prefix
                  const rest = urlPath.replace('/docs/', '');
                  fsPath = path.join(process.cwd(), 'docs', rest);
                } else if (urlPath.startsWith('/reference/')) {
                  const rest = urlPath.replace('/reference/', '');
                  fsPath = path.join(process.cwd(), 'reference', rest);
                } else if (urlPath.startsWith('/byoc/')) {
                  const rest = urlPath.replace('/byoc/', '');
                  fsPath = path.join(process.cwd(), 'versioned_docs', 'version-byoc', rest);
                } else {
                  return next();
                }

                console.log('[embed-markdown] Mapped to filesystem path:', fsPath);

                if (fsPath && fs.existsSync(fsPath)) {
                  const content = fs.readFileSync(fsPath, 'utf-8');
                  res.set('Content-Type', 'text/markdown; charset=utf-8');
                  res.send(content);
                } else {
                  console.log('[embed-markdown] File not found:', fsPath);
                  res.status(404).send(`Markdown file not found: ${urlPath}\nLooking for: ${fsPath}`);
                }
              });

              return middlewares;
            },
          },
        };
      }
    },
  };
};
