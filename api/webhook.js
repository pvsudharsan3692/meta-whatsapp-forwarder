export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const mode = req.query['hub.mode'];

    if (mode === 'subscribe' && token === '123456') {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verification failed');
  }

  if (req.method === 'POST') {
    console.log("Incoming message:", JSON.stringify(req.body));

    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      await fetch('https://pvautomationsolutions.app.n8n.cloud/webhook-test/a1c94564-c6fa-478f-9065-b1a8dac8afd4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      return res.status(200).send('Message forwarded to n8n');
    }

    return res.status(200).send('Non-message payload ignored');
  }

  return res.status(405).send('Method Not Allowed');
}

