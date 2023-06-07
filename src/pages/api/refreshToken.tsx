export default function handler(req, res) {
  const body = JSON.parse(req.body)
 
  const options = {method: 'POST', headers: {accept: '*/*',   authorization: `Bearer ${body.refreshToken}`},
  body:JSON.stringify(body.refreshToken)};


  
    fetch(process.env.NEXT_PUBLIC_SXT_URL + 'v1/auth/refresh', options)
      .then((response) => response.json())
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  }
  