/* eslint-disable spellcheck/spell-checker */
import { CognitoJwtVerifier } from "aws-jwt-verify"

export const verifier = CognitoJwtVerifier.create({
  userPoolId: import.meta.env.VITE_TEST_AWS_USER_POOL_ID,
  tokenUse: "access",
  clientId: import.meta.env.VITE_TEST_AWS_CLIENT_ID,
})

export const verifyToken = async (token: string) => {
  try {
    const payload = await verifier.verify(token)
    console.log("Token is valid. Payload:", payload)
    return payload
  } catch {
    console.log("Token not valid!")
    return null
  }
}