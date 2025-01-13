/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ActionFunctionArgs, Form, Link, redirect, type MetaFunction } from "react-router"

// import { Welcome } from "../welcome/welcome";

import type { Route } from "./+types/home"

import { PAGE_URL } from "~/constants/pageUrl";
import { getUserId, getAccessToken, logout } from "~/services/session.server"
import { Apis } from "~/utils/apis"

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await getUserId(request)
  const accessToken = await getAccessToken(request)
  if (!userId) {
    throw redirect(PAGE_URL.LOGIN)
  } else {
    return { userId: userId, accessToken: accessToken }
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("action!")
  const response = logout(request)
  throw response
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const getJwt = () => async () => {
    const res = Apis.get("/auth/jwk", null)
  }
  const secure = () => async () => {
    const res = Apis.get("/auth/secure", {
      headers: {
        authorization: `Bearer ${loaderData.accessToken}`
      }
    })
  }
  const noSecure = () => async () => {
    const res = Apis.get("/auth/not_secure", null)
  }
  const test = () => async () => {
    const res = Apis.get("/auth/test", {
      headers: {
        authorization: `Bearer ${loaderData.accessToken}`,
        username: "chconan"
      }
    })
  }
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
            <button className="btn" onClick={getJwt()} type="button">토큰 확인</button>

            <div className="flex items-center justify-center">
              <button className="btn" onClick={secure()} type="button">토큰 보안O</button>
            </div>

            <div className="flex items-center justify-center">
              <button className="btn" onClick={noSecure()} type="button">토큰 보안X</button>
            </div>

            <div className="flex items-center justify-center">
              <button className="btn" onClick={test()} type="button">토큰 테스트</button>
            </div>
          </div>
        ) : (
          <Link to={PAGE_URL.LOGIN}>Login</Link>
        )}
      </div>
    </div>
  )
}

