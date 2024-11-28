import { redirect } from "react-router"

export const userSignUp = async ({
  email,
  redirectUrl
}: {
  email: string
  redirectUrl?: string
}) => {
  console.log(email)
  return redirect(redirectUrl || "/", {})
}
