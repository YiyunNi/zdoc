import {describe, expect, it} from 'vitest';
import {makeTelemetry} from './telemetry.js';

describe('makeTelemetry', () => {
  it('disables raw input and output recording by default', () => {
    const telemetry = makeTelemetry('chat-stream', {requestId: 'req-1'});

    expect(telemetry).toEqual({
      isEnabled: true,
      functionId: 'chat-stream',
      metadata: {requestId: 'req-1'},
      recordInputs: false,
      recordOutputs: false,
    });
  });
});
