export default function handler(req, res) {
    const options = {method: 'POST', headers: {accept: '*/*'}};


  
    fetch(process.env.NEXT_PUBLIC_SXT_URL + 'v1/auth/refresh', options)
      .then((response) => response.json())
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  