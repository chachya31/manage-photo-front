/* eslint-disable perfectionist/sort-object-types */
import { createCookieSessionStorage, redirect } from "react-router"

type User = { id: string; password: string; username: string; }

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
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  })
}

const USER_SESSION_KEY = "userId"

export const getUserId = async (request: Request): Promise<User["id"] | undefined> => {
  const session = await getUserSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}

export const createUserSession = async ({
  request,
  userId,
  remember = true,
  redirectUrl,
}: {
  request: Request
  userId: string
  remember: boolean
  redirectUrl?: string
}) => {
  const session = await getUserSession(request)
  session.set(USER_SESSION_KEY, userId)
  return redirect(redirectUrl || "/", {
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
