import { request } from "http";

export default function handler(req, res) {
 const body = JSON.parse(req.body)
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: body.authorization,
      biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_CATEGORY}`,
      originApp: '3D Print Near Me',
    },
    body: JSON.stringify({ sqlText:`DELETE from PRINTNEARME.CATEGORY where ID='${body.id}'`, resourceId:"PRINTNEARME.CATEGORY" }),
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
      res.status(500).json('Error Deleting Category');
    });
  
}
