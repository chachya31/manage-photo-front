/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ActionFunctionArgs, Form, Link, redirect, type MetaFunction } from "react-router"

// import { Welcome } from "../welcome/welcome";

import type { Route } from "./+types/home"

import { PAGE_URL } from "~/constants/pageUrl";
import { getUserId, logout } from "~/services/session.server"

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await getUserId(request)
  if (!userId) {
    throw redirect(PAGE_URL.LOGIN)
  } else {
    return { userId }
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("action!")
  const response = logout(request)
  throw response
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to React Router v7 Auth</h1>
      <div className="mt-6">
        {loaderData?.userId ? (
          <div>
            <p className="mb-6">You are logged in {loaderData?.userId}</p>
            <Form action="/logout" method="post">
              <button className="border rounded px-2.5 py-1" type="submit">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link to={PAGE_URL.LOGIN}>Login</Link>
        )}
      </div>
    </div>
  )
}

