/* eslint-disable perfectionist/sort-object-types */
import { createCookieSessionStorage, redirect } from "react-router"
import { FlashMessage } from "react-router-flash-message";

import { PAGE_URL } from "~/constants/pageUrl";

type User = { id: string; password: string; username: string; accessToken: string; refreshToken: string }

export const authSessionStorage = createCookieSessionStorage({
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

export const { commitSession, destroySession } = authSessionStorage

const getUserSession = async (request: Request) => {
  return await authSessionStorage.getSession(request.headers.get("Cookie"))
}

export const logout = async (request: Request) => {
  const headers = new Headers()
  const session = await getUserSession(request)
  const { cookie } = await flashMessage.set({
    request,
    data: {
      message: "ログアウト成功！"
    }
  })
  headers.set("Set-Cookie", await authSessionStorage.destroySession(session))
  headers.append("Set-Cookie", cookie)
  return redirect(PAGE_URL.ROUTE, { headers })
}

const USER_SESSION_KEY = "userId"
const USER_ACCESS_KEY = "AccessToken"
const USER_REFRESH_TOKEN = "RefreshToken"

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

export const getRefreshToken = async (request: Request): Promise<User["refreshToken"] | undefined> => {
  const session = await getUserSession(request)
  const refreshToken = session.get(USER_REFRESH_TOKEN)
  return refreshToken
}

export const getFlashMessage = async (request: Request) => {
  const session = await getUserSession(request)
  const message = session.get("globalMessage")
  return message
}

export const createUserSession = async ({
  request,
  userId,
  accessToken,
  refreshToken,
  remember = true,
  redirectUrl,
}: {
  request: Request
  userId: string
  accessToken: string
  refreshToken: string
  remember: boolean
  redirectUrl?: string
}) => {
  const session = await getUserSession(request)
  session.set(USER_SESSION_KEY, userId)
  session.set(USER_ACCESS_KEY, accessToken)
  session.set(USER_REFRESH_TOKEN, refreshToken)
  return redirect(redirectUrl || PAGE_URL.ROUTE, {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session, {
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
      "Set-Cookie": await authSessionStorage.commitSession(session, {
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

const FLASH_MESSAGE_SESSION_KEY = "flash_message"

export type FlashMessageColor = "success" | "warning" | "danger" | undefined

export type FlashMessageData = {
  [FLASH_MESSAGE_SESSION_KEY]: {
    color?: FlashMessageColor
    message: string
  }
}

export const flashMessageStorage = createCookieSessionStorage<FlashMessageData>({
  cookie: {
    name: "flash_message_session",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
})

export const flashMessage = new FlashMessage<FlashMessageData>({
  sessionStorage: flashMessageStorage,
  sessionKey: FLASH_MESSAGE_SESSION_KEY,
})

export const createFlashMessageSession = async ({
  request,
  message,
  redirectUrl,
}: {
  request: Request
  message: string
  redirectUrl?: string
}) => {
  const session = await getUserSession(request)
  session.flash(FLASH_MESSAGE_SESSION_KEY, message)
  return redirect(redirectUrl || PAGE_URL.ROUTE, {
    headers: {
      "Set-Cookie": await flashMessageStorage.commitSession(session)
    }
  })
}

