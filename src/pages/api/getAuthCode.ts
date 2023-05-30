export default function handler(req, res) {
    const options = {
      method: 'POST',
      headers: { accept: '*/*', 'content-type': 'application/json' },
      body: JSON.stringify({ userId: process.env.NEXT_PUBLIC_SXT_USERID }),
    };
  
    fetch(process.env.NEXT_PUBLIC_SXT_URL + 'v1/auth/code', options)
      .then((response) => response.json())
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  