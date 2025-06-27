export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { method, url } = req;

  if (method === 'GET') {
    const { searchParams } = new URL(url);
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');
    const mode = searchParams.get('hub.mode');

    if (mode === 'subscribe' && token === '123456') {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Verification failed', { status: 403 });
  }

  if (method === 'POST') {
    const body = await req.json();
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const response = await fetch(
        'https://pvautomationsolutions.app.n8n.cloud/webhook-test/a1c94564-c6fa-478f-9065-b1a8dac8afd4',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      return new Response('Message forwarded to n8n', { status: 200 });
    }

    return new Response('Non-message payload ignored', { status: 200 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
