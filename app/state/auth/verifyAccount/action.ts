
import { parseWithZod } from "@conform-to/zod"

import { createVerifyAccountSchema } from "./schema"

import type { ActionFunctionArgs } from "react-router"

import { API_URL } from "~/constants/apiUrl"
import { createUserSession } from "~/services/session.server"
import { Apis } from "~/utils/apis"

export const verifyAccountAction = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const schema = createVerifyAccountSchema()
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema });
    const res = await Apis.post(API_URL.VERIFY_ACCOUNT, submission.payload)
    const email = submission.payload.email.toString()

    if (res.status !== 200) {
      if (res.status === 403) {
        return { modal: true }
      } else {
        throw new Error(`Login Failed: ${res.data.detail[0].msg}`)
      }
    } else {
      response = await createUserSession({
        request,
        userId: email,
        remember: true
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }
  return response
}