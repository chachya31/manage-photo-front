/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable spellcheck/spell-checker */
import {
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useTranslation } from 'react-i18next';
import { Form, Link, type MetaFunction } from "react-router"

import type * as Route from "./+types/login"

import { Input } from "~/components/ui/input"
import { PAGE_URL } from "~/constants/pageUrl";
import { loginAction } from "~/state/auth/login/action"
import { loginLoader } from "~/state/auth/login/loader"
import { createLoginSchema } from "~/state/auth/login/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Login" },
    { name: "description", content: "Welcome to React Router Login!" },
  ]
}

export const loader = loginLoader

export const action = loginAction

export default function Login({ actionData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const schema = createLoginSchema()
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
          {t("loginTitle")}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post" {...getFormProps(form)}>
          <div>
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.email.id}>
              {t("mailAddress")}
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

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.password.id}>
                {t("password")}
              </label>
              <div className="text-sm">
                <Link className="font-semibold text-indigo-600 hover:text-indigo-500" to={PAGE_URL.FORGOT_PASSWORD}>
                  {t("forgotPasswordLinkMessage")}
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.password, { type: "password"})}
                autoComplete="current-password"
                className={`${
                  fields.password.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
              />
            </div>
            {fields.password.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.password.errors}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="btn btn-primary btn-wide"
              type="submit"
            >
              {t("login")}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link className="font-semibold text-indigo-600 hover:text-indigo-500" to={PAGE_URL.SIGN_UP}>
              {t("signUpLinkMessage")}
            </Link>
          </div>

          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  )
}