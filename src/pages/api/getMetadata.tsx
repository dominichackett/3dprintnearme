export default function handler(req, res) {
    const { url } = req.query
    
    
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json(err);
        });
    }
    