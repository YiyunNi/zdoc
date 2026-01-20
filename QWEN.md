# Document Internationalization

This Docusaurus site hosts Zilliz Cloud documents in English. Additionally, we provide translations for some documents in other languages. Here is a list of available translations:

- Japanese

We use QWEN code to implement the translation feature and utilize the Agent of the corresponding language to translate the documents. Available Agents are listed below:

- Japanese Translation Agent

## Folder Structure

The English documents are located in the following folders:

- `/docs/tutorials` (SaaS documents)
- `/versioned_docs/version-byoc/tutorials` (BYOC documents)

The translated documents are located in the same folder structure within the `i18n` folder. For example, the Japanese documents are located in the following folders:

- `/i18n/ja-JP/docusaurus-plugin-content-docs/current/tutorials` (SaaS documents)
- `/i18n/ja-JP/docusaurus-plugin-content-docs/version-byoc/current/tutorials` (BYOC documents)

## Translation Workflow

1. When asked to translate a suite of documents into a target language, list the documents inside the target source and destination folders.
2. Compare the English documents with the translated documents to identify any differences.
3. Translate the English documents into the target language using the corresponding Agent.
4. Update the translated documents in the target source folder.
5. Update the translated documents in the target destination folder.
6. Test the translated documents to ensure they are accurate and complete.
7. Submit the translated documents for review and approval.

## Configuration Files

The following configuration files are used in the internationalization process:

- `docusaurus.config.js`: Main Docusaurus configuration file that includes i18n settings
- `sidebars.js`: Sidebar navigation for default language
- `sidebarsReference.js`: Sidebar navigation for reference documents
- `sidebarsTutorial.js`: Sidebar navigation for tutorial documents
- `translation.db`: Database containing translation mappings
- `versions.json`: Version information for documentation

## Translation Quality Assurance

To ensure high-quality translations:

- All translations should maintain the original meaning and context
- Technical terms should be consistently translated across all documents
- Translated documents should preserve the format of the original document, including headings, images, and other formatting
- Translated documents should be reviewed by native speakers when possible
- Regular audits should be performed to identify outdated translations

## Custom QWEN Commands for Translation Workflow

The following custom QWEN commands have been created to streamline the document translation process:

### 1. Document Comparison Command
**Command**: `/i18n:compare`
**Description**: Compare English documents with translated documents to identify differences
**Usage**: `/i18n:compare source_path target_path`

### 2. Translation Command
**Command**: `/i18n:translate`
**Description**: Translate English documents into the target language using appropriate terminology
**Usage**: `/i18n:translate target_language content`

### 3. Quality Assurance Command
**Command**: `/i18n:qa`
**Description**: Perform quality assurance on translated documents
**Usage**: `/i18n:qa content`

### 4. Bulk Translation Command
**Command**: `/i18n:batch-translate`
**Description**: Translate multiple documents in a directory
**Usage**: `/i18n:batch-translate source_dir target_dir target_language`

### 5. Translation Status Check
**Command**: `/i18n:status`
**Description**: Check the translation status of documents
**Usage**: `/i18n:status source_dir target_dir`

### 6. Terminology Lookup
**Command**: `/i18n:terms`
**Description**: Look up established translations for technical terms
**Usage**: `/i18n:terms target_language terms_list`

## Implementation of the Translation Workflow Using QWEN Commands

1. **Initialization**: Use `/i18n:status` to identify documents that need translation
2. **Document Analysis**: Use `@` commands to load source documents and analyze content
3. **Translation**: Use `/i18n:translate` for individual documents or `/i18n:batch-translate` for multiple documents
4. **Quality Control**: Use `/i18n:qa` to review translations
5. **Comparison**: Use `/i18n:compare` to verify translations match source content
6. **Terminology Management**: Use `/i18n:terms` to ensure consistency
7. **Tracking**: Use `/todo_write` to track progress through the translation tasks