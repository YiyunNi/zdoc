const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { resolveRepoBranch } = require('./index');

function withTempDir(callback) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lark-docs-index-'));
    try {
        return callback(dir);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

function testResolveRepoBranchFromNormalGitDir() {
    withTempDir(dir => {
        fs.mkdirSync(path.join(dir, '.git'));
        fs.writeFileSync(path.join(dir, '.git', 'HEAD'), 'ref: refs/heads/main\n');

        assert.equal(resolveRepoBranch(dir), 'main');
    });
}

function testResolveRepoBranchFromWorktreeGitFile() {
    withTempDir(dir => {
        const gitDir = path.join(dir, '..', 'repo.git', 'worktrees', 'feature-docs');
        fs.mkdirSync(gitDir, { recursive: true });
        fs.writeFileSync(path.join(dir, '.git'), `gitdir: ${gitDir}\n`);
        fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/worktree-mdx-code-span-normalization\n');

        assert.equal(resolveRepoBranch(dir), 'worktree-mdx-code-span-normalization');
    });
}

function run() {
    testResolveRepoBranchFromNormalGitDir();
    testResolveRepoBranchFromWorktreeGitFile();
    console.log('lark-docs index tests passed');
}

run();
