/* eslint-disable spellcheck/spell-checker */
/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Form, Link, redirect, type MetaFunction, useNavigate } from "react-router"
import { z } from "zod";

import type * as Route from "./+types/verifyAccount"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";


import { Alert, AlertDescription } from "~/components/ui/alert";
import { Input } from "~/components/ui/input"
import { createUserSession ,getUserId, getTempUserId } from "~/services/session.server"
import { Apis } from "~/utils/apis";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Verify" },
    { name: "description", content: "Welcome to React Router Verify!" },
  ]
}

const schema = z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください。" })
    .email("メールアドレス形式ではありません。"),
  confirmation_code: z
    .string({ required_error: "認証コードを入力してください。" }),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await getUserId(request)
  if (userId) {
    return redirect("/")
  }
  userId = await getTempUserId(request)
  if (userId) {
    return userId
  } else {
    return redirect("/login")
  }
}

const ResendModal = (props: { open: boolean, userId: string }) => {
  const properties = props
  return (
    <dialog className="modal" id="my_modal_1" open={properties.open}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">期限切れ！</h3>
        <p className="py-4">認証コードの有効期限が切れました。</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={resendConfirmationCode(properties.userId)}>再発行</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

const resendConfirmationCode = (email: string) => async () => {
  // const navigate = useNavigate();
  let response: Response
  try {
    const formData = new FormData()
    formData.append("email", email)
    const res = await Apis.postForm("/api/v1/auth/resend_confirmation_code", formData)
    console.log(res)

    if (res.status !== 200) {
      throw new Error(`Login Failed: ${res.data.detail[0].msg}`)
    } else {
      console.log("success!")
      response = redirect("/login")
      // navigate("/login")
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }
  return response
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema });
    const res = await Apis.post("/api/v1/auth/verify_account", submission.payload)

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
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }
  return response
}

export default function VerifyAccount({ actionData, loaderData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const email = loaderData
  return (
    <div className="container mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Verify your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post" {...getFormProps(form)}>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.email.id}>
              Email address
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.email, { type: "email"})}
                readOnly={email? true : false}
                value={email}
              />
            </div>
            {fields.email.errors && (
              <span>{fields.email.errors}</span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.confirmation_code.id}>
                認証キー
              </label>
            </div>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.confirmation_code, { type: "text"})}
                autoFocus
                className={`${
                  fields.confirmation_code.errors
                    ? 'outline outline-red-500 focus-visible:ring-red-500'
                    : ''
                  }`}
              />
            </div>
            {fields.confirmation_code.errors && (
              <span>{fields.confirmation_code.errors}</span>
            )}
          </div>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              認証コードを送信
            </button>
          </div>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={resendConfirmationCode(email)}
            >
              テスト
            </button>
          </div>

          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </Form>
      </div>
      {(actionData?.modal)  && <ResendModal open={actionData.modal} userId={email} />}
    </div>
  )
}