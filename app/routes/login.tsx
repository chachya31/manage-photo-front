/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable spellcheck/spell-checker */
import {
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Form, Link, redirect, type MetaFunction, useNavigate } from "react-router"
import { z } from "zod";

import type * as Route from "./+types/login"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Input } from "~/components/ui/input"
import { createUserSession, getUserId, createTempUserSession } from "~/services/session.server"
import { Apis } from "~/utils/apis";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Login" },
    { name: "description", content: "Welcome to React Router Login!" },
  ]
}

const schema = z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください。" })
    .email("メールアドレス形式ではありません。"),
  password: z
    .string({ required_error: "パスワードを入力してください。" }),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  if (userId) {
    return redirect("/")
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const formData = await request.formData()
    const email = formData.get("email")?.toString()
    const submission = parseWithZod(formData, { schema });

    const res = await Apis.post("/api/v1/auth/signin", submission.payload)

    if (res.status !== 200) {
      if (res.status === 403) {
        response = await createTempUserSession({
          request, userId: email, redirectUrl: "/verify_account"
        })
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

export default function Login({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  return (
    <div className="container mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form method="post" className="space-y-6" {...getFormProps(form)}>
          <div>
            <label htmlFor={fields.email.id} className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.email, { type: "email"})}
                className={`${
                  fields.email.errors
                    ? 'outline outline-red-500 focus-visible:ring-red-500'
                    : ''
                  }`}
                autoFocus
                autoComplete="email"
              />
            </div>
            {fields.email.errors && (
              <span>{fields.email.errors}</span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor={fields.password.id} className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a className="font-semibold text-indigo-600 hover:text-indigo-500" href="#">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.password, { type: "password"})}
                className={`${
                  fields.password.errors
                    ? 'outline outline-red-500 focus-visible:ring-red-500'
                    : ''
                  }`}
                autoFocus
                autoComplete="current-password"
              />
            </div>
            {fields.password.errors && (
              <Alert>
                <AlertDescription>
                  {fields.password.errors}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/signup">Sign up</Link>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>

          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  )
}