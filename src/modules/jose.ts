/**
 * "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS with no dependencies
 * using runtime's native crypto in Node.js, Browser, Cloudflare Workers, Electron, and Deno.
 */

import * as jose from 'jose'

export const signJWT = async (config: { data: Object, secretKey: string, expirationTime?: string, algorithm?: string }) => {
    const { data, secretKey, expirationTime, algorithm } = config

    const uint8array = new TextEncoder("utf-8").encode(secretKey)
    // const decodedSecret = new TextDecoder("utf-8").decode(uint8array);
    const jwt = await new jose.SignJWT({ ...data })
        .setProtectedHeader({ alg: algorithm || 'ES256' })
        .setExpirationTime(expirationTime || '2h')
        .sign(uint8array)

    console.log("jwt", jwt)

    // const { payload, protectedHeader } = await jose.jwtVerify(jwt, uint8array)

    // console.log(protectedHeader)
    // console.log(payload)

    return jwt
}

// ? cannot import jsonwebtoken with ESM - check https://github.com/auth0/node-jsonwebtoken/issues/785
// import jwt from 'jsonwebtoken';
// const { sign, verify } = jwt;
// import { sign } from 'jsonwebtoken'

// export const signJWT = async (config: { data: Object, secretKey: string, expirationTime: string, algorithm: string }) => {
//     // debugger
//     const { data, privateKey, expirationTime, algorithm } = config

//     const secretKey = "PoXmvxZB7aJVmwmWL2kCv1sRfSfreiVopvoKJ36wNuF"
//     const token = sign(data, secretKey, { algorithm, expiresIn: expirationTime });

//     console.log(token)
//     return sign
// }


