import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { auth } from '../config';

const getCookie = (src, name) => {
  const value = `; ${src}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export async function context(headers, secrets) {
  const authorization = auth.strategies.localStorage ? headers["authorization"] : auth.strategies.httpOnly ? headers['cookie'] : '';
  const uuid = headers['uuid'];
  const fingerprint = headers['fingerprint'];
  const user = await validateUser(authorization, secrets, uuid, fingerprint);
  return {
    user,
    secrets,
    uuid,
    fingerprint,
    headers,
  };
}

async function validateUser(authorization, secrets, uuid, fingerprint) {
  const addSecurityChecks = {};

  if (uuid) {
    addSecurityChecks.jwtid = uuid; // TODO: THIS SHOULD BE EITHER HASHED OR ENCRYPTERD OR THE JWT PAYLOAD SHOULD. PERFORMANCE OF THE EVENTUAL SOLUTION MATTERS A TON HERE
  }
  if (fingerprint) {
    addSecurityChecks.subject = fingerprint; // TODO: SAME AS ABOVE
  }
  const authLength = auth.strategies.localStorage ? "Bearer ".length : auth.strategies.httpOnly ? `${auth.cookie.name}=`.length : '';
  if (authorization && authorization.length > authLength) {
    const token = auth.strategies.localStorage ? authorization.slice(authLength) : auth.strategies.httpOnly ? getCookie(authorization, auth.cookie.name) : '';
    const { ok, result } = await new Promise(resolve =>
      jwt.verify(token, secrets.AUTH_SECRET, {...addSecurityChecks}, (err, result) => {
        if (err) {
          resolve({
            ok: false,
            result: err
          });
        } else {
          resolve({
            ok: true,
            result
          });
        }
      })
    );
    if (ok) {
      /*const profileRequest = await fetch(
        `https://${secrets.AUTH_ENDPOINT}/tokeninfo`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            id_token: token
          })
        }
      );
      const profile = await profileRequest.json();
      return {
        ...profile,
        id: result.sub
      };*/

      return {
        id: result.id,
        nickname: result.nickname,
        email: result.email
      }
    } else {
      console.error(result);
    }
  }

  return null;
}
