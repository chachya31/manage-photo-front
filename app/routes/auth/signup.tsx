/* eslint-disable spellcheck/spell-checker */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable react/function-component-definition */
import { Form, redirect, type MetaFunction } from "react-router"

import type * as Route from "./+types/signup"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { Input } from "~/components/ui/input"
import { getUserId } from "~/services/session.server"
import { userSignUp } from "~/services/signup.server"

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Login" },
    { name: "description", content: "Welcome to React Router Login!" },
  ]
}

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

    response = await userSignUp({ email: email,  redirectUrl: "/" })

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

export default function SignUp({ actionData }: Route.ComponentProps) {
  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Input your mail address
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form method="post" className="space-y-12">
          <div className="sm:col-span-4">
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder=""
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Phone Number
            </label>
            <div className="mt-2">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="ハイフン(-)なしで入力してください。"
                autoComplete="mobile tel"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900">
              Role
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                autoComplete="role"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
              >
                <option>Admin</option>
                <option>Customer</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="passwordRe" className="block text-sm/6 font-medium text-gray-900">
              Password(Re)
            </label>
            <div className="mt-2">
              <Input
                id="passwordRe"
                name="passwordRe"
                type="password"
                placeholder=""
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>

          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </Form>
      </div>
    </main>
  )
}
