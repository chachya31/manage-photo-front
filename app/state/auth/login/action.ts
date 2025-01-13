import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "react-router";

import { createLoginSchema } from "./schema";

import { API_URL } from "~/constants/apiUrl";
import { createTempUserSession, createUserSession } from "~/services/session.server";
import { Apis } from "~/utils/apis";


export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const schema = createLoginSchema()
  let response: Response
  try {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema });

    const res = await Apis.post(API_URL.LOGIN, submission.payload)
    const accessToken = res.data.AccessToken

    if (res.status !== 200) {
      if (res.status === 403) {
        response = await createTempUserSession({
          request, userId: submission.payload.email.toString(), redirectUrl: "/verify_account"
        })
      } else {
        throw new Error(`Login Failed: ${res.data.detail[0].msg}`)
      }
    } else {
      response = await createUserSession({
        request,
        userId: submission.payload.email.toString(),
        accessToken,
        remember: true
      });
    }

    if (!response) {
      throw new Error("An error occurred while creating the session")
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }

  throw response
}