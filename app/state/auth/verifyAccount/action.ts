
import { parseWithZod } from "@conform-to/zod"
import { redirect, type ActionFunctionArgs } from "react-router"

import { createVerifyAccountSchema } from "./schema"


import { API_URL } from "~/constants/apiUrl"
import { PAGE_URL } from "~/constants/pageUrl"
import { Apis } from "~/utils/apis"

export const verifyAccountAction = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const schema = createVerifyAccountSchema()
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema });
    const res = await Apis.post(API_URL.VERIFY_ACCOUNT, submission.payload)

    if (res.status !== 200) {
      if (res.status === 403) {
        return { modal: true }
      } else {
        throw new Error(`Login Failed: ${res.data.detail[0].msg}`)
      }
    }
    response = redirect(PAGE_URL.LOGIN)
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }
  return response
}