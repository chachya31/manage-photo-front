import { parseWithZod } from "@conform-to/zod"

import { createForgotPasswordSchema } from "./schema";

import type { ActionFunctionArgs } from "react-router";

import { API_URL } from "~/constants/apiUrl";
import { PAGE_URL } from "~/constants/pageUrl";
import { createTempUserSession } from "~/services/session.server"
import { Apis } from "~/utils/apis";


export const forgotPasswordAction = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const schema = createForgotPasswordSchema()
    const formData = await request.formData()
    const submission = await parseWithZod(formData, { schema })

    if (submission.status !== "success") {
      return submission.reply()
    }

    const res = await Apis.post(API_URL.FORGOT_PASSWORD, submission.payload)
    if (res.status !== 200) {
      throw new Error(`Failed: ${res.data.detail[0].msg}`)
    }
    response = await createTempUserSession({
      request, userId: submission.payload.email.toString(), redirectUrl: PAGE_URL.CONFIRM_FORGOT_PASSWORD
    })
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }

  throw response
}