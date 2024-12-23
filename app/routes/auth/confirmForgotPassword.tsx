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
import { Form, type MetaFunction } from "react-router"

import type * as Route from "./+types/confirmForgotPassword"

import { Input } from "~/components/ui/input"
import { confirmForgotPasswordAction } from "~/state/auth/forgotPassword/confirm/action"
import { createConfirmForgotPasswordSchema } from "~/state/auth/forgotPassword/confirm/schema"
import { tempLoginCheckLoader } from "~/state/common/commonLoader"


export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Forget Password" },
    { name: "description", content: "Welcome to React Router Login!" },
  ]
}

export const loader = tempLoginCheckLoader
export const action = confirmForgotPasswordAction

export default function ConfirmForgotPassword({ actionData, loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const schema = createConfirmForgotPasswordSchema()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const email = loaderData.email
  return (
    <div className="container mx-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {t("pageTitle.passwordReset")}
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
                key={fields.email.key}
                readOnly={email ? true : false}
                value={email}
              />
            </div>
            {fields.email.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.email.errors}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.confirmation_code.id}>
                {t("content.confirmationCode")}
              </label>
            </div>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.confirmation_code, { type: "text" })}
                className={`${fields.confirmation_code.errors
                  ? 'outline outline-red-500 focus-visible:ring-red-500'
                  : ''
                  }`}
              />
            </div>
            {fields.confirmation_code.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.confirmation_code.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.new_password.id}>
              {t("content.password")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.new_password, { type: "password" })}
                className={`${
                  fields.new_password.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.new_password.key}
              />
            </div>
            {fields.new_password.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.new_password.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.new_password_re.id}>
              {t("content.passwordRe")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.new_password_re, { type: "password" })}
                className={`${
                  fields.new_password_re.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.new_password_re.key}
              />
            </div>
            {fields.new_password_re.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.new_password_re.errors}</span>
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
