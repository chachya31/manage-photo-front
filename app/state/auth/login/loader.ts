import { LoaderFunctionArgs, redirect } from "react-router"

import { PAGE_URL } from "~/constants/pageUrl"
import { getUserId } from "~/services/session.server"


export const loginLoader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  if (userId) {
    return redirect(PAGE_URL.ROUTE)
  }
  return { data: "data" }
}