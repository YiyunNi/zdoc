import {expect, test} from '@playwright/test';

const requestIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const expectedSseEvents = ['session', 'agent', 'tool-call', 'delta', 'confidence', 'sources', 'grounding', 'done'];

function sse(events: Array<{event: string; data: unknown}>): string {
  return events.map(({event, data}) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`).join('');
}

test('streams a correlated chat response with safe console debug logs', async ({page}) => {
  const prompt = 'secret E2E user prompt 7845';
  const assistantAnswer = 'secret deterministic assistant answer 9361';
  const serverSessionId = 'server-session-e2e-secret';
  const debugPayloads: Array<Record<string, unknown>> = [];
  const debugLogTexts: string[] = [];
  const debugMessagePromises: Array<Promise<unknown[]>> = [];
  let chatRequestCount = 0;
  let capturedRequestId: string | undefined;
  let capturedBody: Record<string, unknown> | undefined;

  page.on('console', msg => {
    if (msg.type() !== 'debug') return;
    debugLogTexts.push(msg.text());
    const valuesPromise = Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => undefined)));
    debugMessagePromises.push(valuesPromise);
    void valuesPromise.then(values => {
      if (values[0] === '[chat-debug]' && values[1] && typeof values[1] === 'object') {
        debugPayloads.push(values[1] as Record<string, unknown>);
      }
    });
  });

  await page.route('**/api/chat', async route => {
    chatRequestCount++;
    const request = route.request();
    capturedRequestId = request.headers()['x-request-id'];
    capturedBody = request.postDataJSON() as Record<string, unknown>;

    expect(capturedRequestId).toMatch(requestIdPattern);
    expect(capturedBody).toMatchObject({
      messages: [{role: 'user', content: prompt}],
      pageUrl: '/docs/home',
      userId: expect.any(String),
    });
    if (capturedBody.pageContext !== undefined) {
      expect(typeof capturedBody.pageContext).toBe('string');
    }

    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'X-Request-ID': capturedRequestId!,
      },
      body: sse([
        {event: 'session', data: {sessionId: serverSessionId, requestId: capturedRequestId}},
        {event: 'agent', data: {type: 'general', name: 'Docs Agent'}},
        {event: 'tool-call', data: {tool: 'search_knowledge', count: 1}},
        {event: 'delta', data: {text: assistantAnswer}},
        {event: 'confidence', data: {level: 'high', retrieval_score: 0.98}},
        {event: 'sources', data: {sources: [{title: 'Deterministic Source', url: '/docs/home', section: 'Guide', score: 0.98}]}},
        {event: 'grounding', data: {citations: [{paragraphIndex: 0, sourceIndices: [0]}]}},
        {event: 'done', data: {stop_reason: 'end_turn'}},
      ]),
    });
  });

  await page.goto('/docs/home?chatDebug=1');
  await expect(page.getByText('Zilliz Copilot')).toBeVisible();

  await page.getByLabel('Chat message').fill(prompt);
  await page.getByRole('button', {name: 'Send'}).click();

  await expect(page.getByText(prompt)).toBeVisible();
  await expect(page.getByText(assistantAnswer)).toBeVisible();
  await expect(page.getByText('Deterministic Source')).toBeVisible();
  await expect(page.getByRole('button', {name: 'Helpful', exact: true})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Not helpful', exact: true})).toBeVisible();

  expect(chatRequestCount).toBe(1);
  expect(capturedRequestId).toMatch(requestIdPattern);
  expect(capturedBody).toBeTruthy();

  await expect.poll(() => debugPayloads.map(payload => payload.event)).toContain('chat.client.completed');

  const fetchResponseDebug = debugPayloads.find(payload => payload.event === 'chat.client.fetch.response');
  expect(fetchResponseDebug).toMatchObject({requestId: capturedRequestId, serverRequestId: capturedRequestId});

  const sseEventNames = debugPayloads
    .filter(payload => payload.event === 'chat.client.sse.event')
    .map(payload => payload.sseEvent);
  expect(sseEventNames).toEqual(expect.arrayContaining(expectedSseEvents));

  const completedDebug = debugPayloads.find(payload => payload.event === 'chat.client.completed');
  const eventCounts = completedDebug?.eventCounts as Record<string, number>;
  for (const eventName of expectedSseEvents) {
    expect(eventCounts[eventName]).toBe(1);
  }

  const allDebugValues = await Promise.all(debugMessagePromises);
  const serializedDebug = `${JSON.stringify(allDebugValues)}\n${debugLogTexts.join('\n')}`;
  expect(serializedDebug).toContain('chat.client.send.started');
  expect(serializedDebug).toContain('chat.client.fetch.response');
  expect(serializedDebug).toContain('chat.client.sse.event');
  expect(serializedDebug).not.toContain(prompt);
  expect(serializedDebug).not.toContain(assistantAnswer);
  expect(serializedDebug).not.toContain(capturedBody!.userId as string);
  expect(serializedDebug).not.toContain(serverSessionId);
});
