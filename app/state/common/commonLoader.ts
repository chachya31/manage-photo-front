import { LoaderFunctionArgs, redirect } from "react-router"

import { PAGE_URL } from "~/constants/pageUrl"
import { flashMessage, getTempUserId, getUserId } from "~/services/session.server"

export const loginCheckLoader = async ({ request }: LoaderFunctionArgs) => {
  const { data: flashMessageData, cookie } = await flashMessage.get({ request })
  const userId = await getUserId(request)
  if (userId) {
    return redirect(PAGE_URL.ROUTE)
  }
  if (flashMessageData) {
    return { flashMessage: flashMessageData }
  }
}

export const tempLoginCheckLoader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await getUserId(request)
  if (userId) {
    return redirect(PAGE_URL.ROUTE)
  }
  userId = await getTempUserId(request)
  if (userId) {
    return { email: userId }
  } else {
    return redirect(PAGE_URL.LOGIN)
  }
}