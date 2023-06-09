import { Readable } from 'stream';

export default async function handler(req: any, res: any) {
  const body = JSON.parse(req.body);

  const response = await fetch(body.gcodeURL);
  if (response.ok) {
    const text = await response.text();

    const formData = new FormData();
    formData.append('file', new Blob([text], { type: 'text/plain' }), body.filename);

    let response1;
    try {
      response1 = await fetch(`${body.printerURL}api/files/local?apikey=${body.apiKey}`, {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      res.status(500).json({ error: `Failed to contact printer` });
    }

    if (response1.ok) {
      const data = await response1.json();

      const response2 = await fetch(`${body.printerURL}api/job?apikey=${body.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command: 'select',
          print: true,
          file: data.path
        })
      });

      if (response2.ok) {
        res.status(200).json(response2);
      } else {
        res.status(500).json({ error: `Failed to start print job: ${response2.statusText}` });
      }
    } else {
      res.status(500).json({ error: `File upload failed: ${response1.statusText}` });
    }
  } else {
    res.status(500).json({ error: 'File download failed' });
  }
}
