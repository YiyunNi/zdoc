/**
 * Telemetry helper for Vercel AI SDK experimental_telemetry.
 * Returns telemetry config when TELEMETRY_ENABLED is not 'false'.
 */

/** Telemetry metadata attribute values (matches OpenTelemetry AttributeValue). */
export type TelemetryAttrValue = string | number | boolean | string[] | number[] | boolean[];

const TELEMETRY_ENABLED = process.env.TELEMETRY_ENABLED !== 'false';

export function makeTelemetry(functionId: string, metadata?: Record<string, TelemetryAttrValue | undefined>) {
  if (!TELEMETRY_ENABLED) return undefined;
  const cleanMeta: Record<string, TelemetryAttrValue> = {};
  if (metadata) {
    for (const [k, v] of Object.entries(metadata)) {
      if (v !== undefined && v !== null) {
        cleanMeta[k] = v;
      }
    }
  }
  return {
    isEnabled: true as const,
    functionId,
    metadata: Object.keys(cleanMeta).length > 0 ? cleanMeta : undefined,
  };
}
