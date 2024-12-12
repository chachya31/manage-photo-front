/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import type * as Route from "./+types/forgotPassword"

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  console.log(actionData)
  return (
    <div className="container mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Forgot Your Password?
        </h2>
      </div>
    </div>
  )
}
