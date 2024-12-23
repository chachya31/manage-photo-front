/* eslint-disable spellcheck/spell-checker */
/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useTranslation } from 'react-i18next'
import { Form, Link, type MetaFunction } from "react-router"

import type * as Route from "./+types/forgotPassword"

import { Input } from "~/components/ui/input"
import { PAGE_URL } from "~/constants/pageUrl"
import { forgotPasswordAction } from "~/state/auth/forgotPassword/action"
import { createForgotPasswordSchema } from "~/state/auth/forgotPassword/schema"
import { loginCheckLoader } from "~/state/common/commonLoader"

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Forget Password" },
    { name: "description", content: "Welcome to React Router Login!" },
  ]
}

export const loader = loginCheckLoader
export const action = forgotPasswordAction

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const schema = createForgotPasswordSchema()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  return (
    <div className="container mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {t("content.passwordResetMessage")}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post" {...getFormProps(form)}>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.email.id}>
              {t("content.mailAddress")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.email, { type: "email"})}
                autoComplete="email"
                className={`${
                  fields.email.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
              />
            </div>
            {fields.email.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.email.errors}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="btn btn-primary btn-wide"
              type="submit"
            >
              {t("content.passwordResetBtn")}
            </button>

            <Link className="font-semibold text-indigo-600 hover:text-indigo-500" to={PAGE_URL.LOGIN}>
              <button className="btn btn-outline" type="button">{t("content.loginLink")}</button>
            </Link>
          </div>

          {actionData?.error ? (
            <div className="label">
              <span className="label-text-alt text-error">{actionData?.error}</span>
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  )
}
