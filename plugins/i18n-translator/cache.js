'use strict'

class TranslationCache {
  constructor(dbPath) {
    const sqlite3 = require('sqlite3').verbose()
    this.db = new sqlite3.Database(dbPath)
    this._ready = this._init()
  }

  _run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err)
        else resolve(this)
      })
    })
  }

  _get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  _all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  async _init() {
    await this._run(`
      CREATE TABLE IF NOT EXISTS i18n_file_manifest (
        file_path     TEXT    NOT NULL,
        locale        TEXT    NOT NULL,
        source_hash   TEXT    NOT NULL,
        glossary_hash TEXT    NOT NULL DEFAULT '',
        translated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (file_path, locale)
      )
    `)
    await this._run(`
      CREATE TABLE IF NOT EXISTS i18n_translation_cache (
        source_hash   TEXT NOT NULL,
        locale        TEXT NOT NULL,
        glossary_hash TEXT NOT NULL DEFAULT '',
        translated_json TEXT NOT NULL,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (source_hash, locale, glossary_hash)
      )
    `)
  }

  async ready() {
    await this._ready
    return this
  }

  /** Returns { sourceHash, glossaryHash } or null */
  async getFileRecord(filePath, locale) {
    await this._ready
    const row = await this._get(
      'SELECT source_hash, glossary_hash FROM i18n_file_manifest WHERE file_path = ? AND locale = ?',
      [filePath, locale]
    )
    return row ? { sourceHash: row.source_hash, glossaryHash: row.glossary_hash } : null
  }

  async setFileRecord(filePath, locale, sourceHash, glossaryHash) {
    await this._ready
    await this._run(
      `INSERT OR REPLACE INTO i18n_file_manifest
         (file_path, locale, source_hash, glossary_hash, translated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [filePath, locale, sourceHash, glossaryHash]
    )
  }

  async deleteFileRecord(filePath, locale) {
    await this._ready
    await this._run(
      'DELETE FROM i18n_file_manifest WHERE file_path = ? AND locale = ?',
      [filePath, locale]
    )
  }

  async deleteTranslation(sourceHash, locale, glossaryHash) {
    await this._ready
    await this._run(
      'DELETE FROM i18n_translation_cache WHERE source_hash = ? AND locale = ? AND glossary_hash = ?',
      [sourceHash, locale, glossaryHash]
    )
  }

  async getAllTrackedFiles(locale) {
    await this._ready
    const rows = await this._all(
      'SELECT file_path FROM i18n_file_manifest WHERE locale = ?',
      [locale]
    )
    return rows.map(r => r.file_path)
  }

  /** Returns parsed translated data or null */
  async getTranslation(sourceHash, locale, glossaryHash) {
    await this._ready
    const row = await this._get(
      `SELECT translated_json FROM i18n_translation_cache
       WHERE source_hash = ? AND locale = ? AND glossary_hash = ?`,
      [sourceHash, locale, glossaryHash]
    )
    return row ? JSON.parse(row.translated_json) : null
  }

  async setTranslation(sourceHash, locale, glossaryHash, data) {
    await this._ready
    await this._run(
      `INSERT OR REPLACE INTO i18n_translation_cache
         (source_hash, locale, glossary_hash, translated_json, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [sourceHash, locale, glossaryHash, JSON.stringify(data)]
    )
  }

  /** Delete all cached translations (and file records) for a locale, or all locales if null */
  async clearCache(locale = null) {
    await this._ready
    if (locale) {
      await this._run('DELETE FROM i18n_translation_cache WHERE locale = ?', [locale])
      await this._run('DELETE FROM i18n_file_manifest WHERE locale = ?', [locale])
    } else {
      await this._run('DELETE FROM i18n_translation_cache')
      await this._run('DELETE FROM i18n_file_manifest')
    }
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close(err => (err ? reject(err) : resolve()))
    })
  }
}

module.exports = { TranslationCache }
