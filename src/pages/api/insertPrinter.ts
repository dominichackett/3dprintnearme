import { request } from "http";

export default function handler(req, res) {
 const body = JSON.parse(req.body)
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: body.authorization,
      biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_PRINTER}`,
      originApp: '3D Print Near Me',
    },
    body: JSON.stringify({ sqlText: body.sqlText, resourceId:body.resourceId }),
  };

  fetch(process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dml', options)
    .then(async(response) => {
      if (!response.ok) {

        throw new Error(JSON.stringify(await response.json()));
      }
      return response.json();
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(err => {
     // console.error(err);
      res.status(200).json({ sqlText: body.sqlText, resourceId:body.resourceId ,err:err.toString(),auth:body.authorization });
    });
  
}
