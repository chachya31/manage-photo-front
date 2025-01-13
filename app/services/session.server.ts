/* eslint-disable perfectionist/sort-object-types */
import { createCookieSessionStorage, redirect } from "react-router"

import { PAGE_URL } from "~/constants/pageUrl";

type User = { id: string; password: string; username: string; accessToken: string; }

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    // eslint-disable-next-line spellcheck/spell-checker
    secrets: ["s3cret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }
})

export const { commitSession, destroySession } = sessionStorage

const getUserSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"))
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)
  return redirect(PAGE_URL.ROUTE, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  })
}

const USER_SESSION_KEY = "userId"
const USER_ACCESS_KEY = "AccessToken"

export const getUserId = async (request: Request): Promise<User["id"] | undefined> => {
  const session = await getUserSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}

export const getAccessToken = async (request: Request): Promise<User["accessToken"] | undefined> => {
  const session = await getUserSession(request)
  const accessToken = session.get(USER_ACCESS_KEY)
  return accessToken
}

export const createUserSession = async ({
  request,
  userId,
  accessToken,
  remember = true,
  redirectUrl,
}: {
  request: Request
  userId: string
  accessToken: string
  remember: boolean
  redirectUrl?: string
}) => {
  const session = await getUserSession(request)
  session.set(USER_SESSION_KEY, userId)
  session.set(USER_ACCESS_KEY, accessToken)
  return redirect(redirectUrl || PAGE_URL.ROUTE, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7日
          : undefined
      })
    }
  })
}

const TEMP_USER_SESSION_KEY = "tempUser"

export const createTempUserSession = async ({
  request,
  userId,
  redirectUrl,
}: {
  request: Request
  userId: string
  redirectUrl?: string
}) => {
  const session = await getUserSession(request)
  session.set(TEMP_USER_SESSION_KEY, userId)
  return redirect(redirectUrl || PAGE_URL.ROUTE, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30 // 30分
      })
    }
  })
}

export const getTempUserId = async (request: Request): Promise<User["id"] | undefined> => {
  const session = await getUserSession(request)
  const userId = session.get(TEMP_USER_SESSION_KEY)
  return userId
}
