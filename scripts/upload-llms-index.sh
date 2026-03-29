#!/usr/bin/env bash
# Upload llms.txt index files to S3 for the chat-proxy to consume.
# Uses the AWS SDK via Node.js (not the aws CLI) because the IAM user's
# credentials are in .env, not in ~/.aws/credentials.
#
# Run after `npx docusaurus build` generates the build/llms/ directory.
#
# Usage:
#   ./scripts/upload-llms-index.sh [build-dir]
#
# Requires: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET in .env

set -euo pipefail

BUILD_DIR="${1:-build}"
LLMS_DIR="$BUILD_DIR/llms"

if [ ! -d "$LLMS_DIR" ]; then
  echo "Error: $LLMS_DIR does not exist. Run 'npx docusaurus build' first."
  exit 1
fi

node -e "
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const s3 = new S3Client({
  credentials: {accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY},
  region: process.env.AWS_REGION,
});

const llmsDir = '$LLMS_DIR';
const files = fs.readdirSync(llmsDir).filter(f => f.endsWith('.txt'));

async function run() {
  for (const file of files) {
    const buffer = fs.readFileSync(path.join(llmsDir, file));
    const key = 'llms-index/' + file;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'text/plain; charset=utf-8',
      CacheControl: 'public, max-age=300',
      ACL: 'public-read',
    }));
    console.log('  ' + file + ' (' + (buffer.length / 1024).toFixed(0) + ' KB)');
  }
  const bucket = process.env.AWS_BUCKET;
  const region = process.env.AWS_REGION;
  console.log('');
  console.log('Done: ' + files.length + ' files uploaded');
  console.log('INDEX_BASE_URL=https://' + bucket + '.s3.' + region + '.amazonaws.com/llms-index');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
"
