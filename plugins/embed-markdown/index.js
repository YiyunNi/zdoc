const fs = require('node:fs');
const path = require('node:path');

module.exports = function (context, options) {
  return {
    name: 'embed-markdown',

    async contentLoaded({ actions }) {
      const { addRoute, setGlobalData } = actions;
      const { siteDir = process.cwd() } = context;
      const sources = ['docs', 'reference', 'versioned_docs'];
      const markdownPathMap = {};

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
              // Build URL path based on file path (actual URL users visit)
              let pagePath;
              
              if (sourceDir === 'docs') {
                pagePath = `/docs/${relativePath ? relativePath + '/' : ''}${entry.name.replace('.md', '')}`;
              } else if (sourceDir === 'reference') {
                pagePath = `/reference/${relativePath ? relativePath + '/' : ''}${entry.name.replace('.md', '')}`;
              } else if (sourceDir === 'versioned_docs') {
                const versionMatch = relativePath.match(/^version-([^/]+)(?:\/(.*))?$/);
                if (versionMatch) {
                  const version = versionMatch[1];
                  const restPath = versionMatch[2] || '';
                  const fileName = entry.name.replace('.md', '');
                  pagePath = version === 'current'
                    ? `/docs/${restPath ? restPath + '/' : ''}${fileName}`
                    : `/docs/${version}/${restPath ? restPath + '/' : ''}${fileName}`;
                }
              }

              if (pagePath) {
                const routePath = pagePath + '.md';
                
                addRoute({
                  path: routePath,
                  component: '@site/src/components/CopyPage/MarkdownRaw',
                  exact: true,
                  modules: {
                    markdownContent: fs.readFileSync(fullPath, 'utf-8'),
                  },
                  priority: 100,
                });
                
                markdownPathMap[routePath] = fullPath;
                console.log(`[embed-markdown] ${routePath} -> ${fullPath}`);
              }
            }
          }
        };

        readFiles(srcPath);
      }

      setGlobalData({ markdownPathMap });
      console.log(`[embed-markdown] Set global data with ${Object.keys(markdownPathMap).length} routes`);
    },

    configureWebpack(_config, isServer) {
      // Add dev server middleware to serve .md files from source directories
      if (!isServer) {
        return {
          devServer: {
            setupMiddlewares: (middlewares, devServer) => {
              const { siteDir = process.cwd() } = context;
              const sources = ['docs', 'reference', 'versioned_docs'];
              const markdownPathMap = {};

              // Build path map (faster than reading files each time)
              for (const sourceDir of sources) {
                const srcPath = path.join(siteDir, sourceDir);
                if (!fs.existsSync(srcPath)) continue;

                const readFiles = (dir, relativePath = '') => {
                  const entries = fs.readdirSync(dir, { withFileTypes: true });
                  for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    const relPath = path.join(relativePath, entry.name);
                    
                    if (entry.isDirectory()) {
                      readFiles(fullPath, relPath);
                    } else if (entry.isFile() && entry.name.endsWith('.md')) {
                      let pagePath;
                      if (sourceDir === 'docs') {
                        pagePath = `/docs/${relativePath ? relativePath + '/' : ''}${entry.name.replace('.md', '')}`;
                      } else if (sourceDir === 'reference') {
                        pagePath = `/reference/${relativePath ? relativePath + '/' : ''}${entry.name.replace('.md', '')}`;
                      } else if (sourceDir === 'versioned_docs') {
                        const versionMatch = relativePath.match(/^version-([^/]+)(?:\/(.*))?$/);
                        if (versionMatch) {
                          const version = versionMatch[1];
                          const restPath = versionMatch[2] || '';
                          const fileName = entry.name.replace('.md', '');
                          pagePath = version === 'current'
                            ? `/docs/${restPath ? restPath + '/' : ''}${fileName}`
                            : `/docs/${version}/${restPath ? restPath + '/' : ''}${fileName}`;
                        }
                      }
                      if (pagePath) {
                        markdownPathMap[pagePath + '.md'] = fullPath;
                      }
                    }
                  }
                };
                readFiles(srcPath);
              }

              console.log(`[embed-markdown] Dev server path map built: ${Object.keys(markdownPathMap).length} entries`);

              devServer.app.get(/\.md$/, (req, res, next) => {
                const urlPath = req.path;
                const fsPath = markdownPathMap[urlPath];
                
                if (fsPath && fs.existsSync(fsPath)) {
                  const content = fs.readFileSync(fsPath, 'utf-8');
                  res.set('Content-Type', 'text/markdown; charset=utf-8');
                  res.send(content);
                } else {
                  next();
                }
              });

              return middlewares;
            },
          },
        };
      }
    },

    async postBuild({ outDir }) {
      console.log('\n[embed-markdown] Copying markdown files to build directory...');

      const sources = ['docs', 'reference', 'versioned_docs'];
      const markdownDestDir = path.join(outDir, '_markdown');

      if (!fs.existsSync(markdownDestDir)) {
        fs.mkdirSync(markdownDestDir, { recursive: true });
      }

      let totalCopied = 0;

      for (const sourceDir of sources) {
        const srcPath = path.join(context.siteDir || process.cwd(), sourceDir);

        if (!fs.existsSync(srcPath)) {
          console.log(`[embed-markdown] Source directory not found: ${srcPath}`);
          continue;
        }

        const copyMarkdownFiles = (dir, relativePath = '') => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const destPath = path.join(markdownDestDir, sourceDir, relativePath, entry.name);

            if (entry.isDirectory()) {
              if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
              }
              copyMarkdownFiles(fullPath, path.join(relativePath, entry.name));
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
              fs.copyFileSync(fullPath, destPath);
              totalCopied++;
              console.log(`[embed-markdown] Copied: ${path.join(sourceDir, relativePath, entry.name)}`);
            }
          }
        };

        copyMarkdownFiles(srcPath);
      }

      console.log(`[embed-markdown] Copied ${totalCopied} markdown files to _markdown/ directory.\n`);
    },
  };
};
