export default async function handler(req, res) {
  if (req.method === 'GET') {
    const VERIFY_TOKEN = "123456"; // your verify token
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === 'POST') {
    console.log("🔔 Incoming Webhook Data:", JSON.stringify(req.body, null, 2));

    // For now, just return the data so we can inspect it
    return res.status(200).json({
      message: "Received",
      data: req.body
    });
  }

  return res.status(405).send('Method Not Allowed');
}

}

