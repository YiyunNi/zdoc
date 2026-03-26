import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { eventStore } from './event-store.js';

const FLUSH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let s3: S3Client | null = null;
let bucket: string | null = null;
let intervalHandle: ReturnType<typeof setInterval> | null = null;
let lastUploadedId: string | null = null;

function isEnabled(): boolean {
  return process.env.LOG_S3_ENABLED === 'true';
}

function initClient(): void {
  if (s3) return;
  s3 = new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  });
  bucket = process.env.AWS_BUCKET ?? '';
}

function buildKey(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const hh = String(now.getUTCHours()).padStart(2, '0');
  return `chat-logs/${yyyy}-${mm}-${dd}/${hh}.ndjson`;
}

export async function flush(): Promise<void> {
  if (!isEnabled()) return;

  try {
    initClient();

    const events = lastUploadedId
      ? eventStore.getNewSince(lastUploadedId)
      : eventStore.getAll();

    if (events.length === 0) return;

    // events are newest-first; upload in chronological order
    const ndjson = events
      .slice()
      .reverse()
      .map((e) => JSON.stringify(e))
      .join('\n');

    const key = buildKey();

    await s3!.send(
      new PutObjectCommand({
        Bucket: bucket!,
        Key: key,
        Body: ndjson,
        ContentType: 'application/x-ndjson',
      }),
    );

    // Mark the newest event as last uploaded
    lastUploadedId = events[0].id;
    console.log(`[log-sink] Uploaded ${events.length} events to s3://${bucket}/${key}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[log-sink] Upload failed: ${message}`);
  }
}

export function startSink(): void {
  if (!isEnabled()) {
    console.log('[log-sink] S3 logging disabled (LOG_S3_ENABLED != true)');
    return;
  }
  if (intervalHandle) return;

  initClient();
  intervalHandle = setInterval(() => {
    flush().catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[log-sink] Interval flush error: ${message}`);
    });
  }, FLUSH_INTERVAL_MS);

  console.log(`[log-sink] Started (interval ${FLUSH_INTERVAL_MS / 1000}s, bucket=${bucket})`);
}

export function stopSink(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    console.log('[log-sink] Stopped');
  }
}
