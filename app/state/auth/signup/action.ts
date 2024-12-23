
import { parseWithZod } from "@conform-to/zod"
import { redirect } from "react-router"

import { createSignUpSchema } from "./schema";

import type { ActionFunctionArgs } from "react-router";

import { API_URL } from "~/constants/apiUrl";
import { PAGE_URL } from "~/constants/pageUrl";
import { Apis } from "~/utils/apis";


export const signUpAction = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const schema = createSignUpSchema()
    const formData = await request.formData()
    const submission = await parseWithZod(formData, { schema })

    if (submission.status !== "success") {
      return submission.reply()
    }

    const res = await Apis.post(API_URL.SIGN_UP, submission.payload)
    if (res.status !== 200) {
      throw new Error(`Failed: ${res.data.detail[0].msg}`)
    }
    response = redirect(PAGE_URL.LOGIN)
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }

  throw response
}