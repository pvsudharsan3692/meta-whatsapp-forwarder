// api/webhook.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const VERIFY_TOKEN = '123456'; // use your token

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }

  if (req.method === 'POST') {
    console.log("Incoming body:", JSON.stringify(req.body));

    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      console.log("Incoming message:", message);

      // Forward only message to n8n
      await fetch('https://pvautomationsolutions.app.n8n.cloud/webhook-test/a1c94564-c6fa-478f-9065-b1a8dac8afd4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      return res.status(200).send('Message forwarded to n8n');
    } else {
      console.log('No message found (likely a status update)');
      return res.status(200).send('No message to forward');
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
