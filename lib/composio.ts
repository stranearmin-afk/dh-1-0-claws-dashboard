// lib/composio.ts
// Shared helper for calling Composio's tool execution API.
// All Google Workspace routes use this instead of raw fetch calls.

const COMPOSIO_BASE = 'https://api.composio.dev/v1';

export async function executeComposioTool(
  app: string,
  tool: string,
  input: Record<string, unknown>
): Promise<any> {
  const entityId = process.env.COMPOSIO_ENTITY_ID;

  const body: Record<string, unknown> = { ...input };
  if (entityId) body.connectedAccountId = entityId;

  const res = await fetch(`${COMPOSIO_BASE}/execute/${app}/${tool}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COMPOSIO_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Composio ${app}/${tool} failed (${res.status}): ${text}`);
  }

  return res.json();
}
