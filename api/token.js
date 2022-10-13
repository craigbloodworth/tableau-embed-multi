var jwt = require('jsonwebtoken');
const { v1: uuidv1 } = require('uuid');

export default function handler(req, res) {
  const username = process.env.TS_USERNAME;
  const uuid = uuidv1();
  const timenow = new Date().getTime();
  const expiry = new Date().getTime() + (5 * 60 * 1000);
  var token = jwt.sign({
        iss: process.env.TS_CLIENT_ID,
        sub: username,
        aud: "tableau",
        exp: expiry / 1000,
        iat: timenow / 1000,
        jti: uuid,
        scp: ["tableau:views:embed", "tableau:metrics:embed"]
      },
      process.env.TS_KEY_SECRET,
      {
          algorithm: 'HS256',
          header: {
            'kid': process.env.TS_KEY_ID,
            'iss': process.env.TS_CLIENT_ID
          }
        }
        );
  res.send(token);
}
