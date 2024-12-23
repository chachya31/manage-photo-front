/* eslint-disable spellcheck/spell-checker */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable react/function-component-definition */
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useTranslation } from 'react-i18next'
import { Form, Link, useNavigation, type MetaFunction } from "react-router"

import type * as Route from "./+types/signup"

import { Input } from "~/components/ui/input"
import { PAGE_URL } from "~/constants/pageUrl"
import { roles } from "~/state/auth";
import { signUpAction } from "~/state/auth/signup/action"
import { createSignUpSchema } from "~/state/auth/signup/schema"
import { loginCheckLoader } from "~/state/common/commonLoader"

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App Login" },
    { name: "description", content: "Welcome to React Router Login!" },
  ]
}

const schema = createSignUpSchema()

export const loader = loginCheckLoader

export const action = signUpAction

export default function SignUp({ actionData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  const isSubmitting = () => {
    return navigation.formAction === PAGE_URL.SIGN_UP
  }
  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {t("pageTitle.signUp")}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-12" method="POST" {...getFormProps(form)}>
          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.email.id}>
              {t("content.mailAddress")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.email, { type: "email" })}
                className={`${
                  fields.email.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.email.key}
              />
            </div>
            {fields.email.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.email.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.full_name.id}>
              {t("content.userName")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.full_name, { type: "text" })}
                className={`${
                  fields.full_name.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.full_name.key}
              />
            </div>
            {fields.full_name.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.full_name.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.phone_number.id}>
              {t("content.phoneNumber")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.phone_number, { type: "tel" })}
                className={`${
                  fields.phone_number.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.phone_number.key}
                placeholder="ハイフン(-)なしで入力してください。"
              />
            </div>
            {fields.phone_number.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.phone_number.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.role.id}>
              {t("content.role")}
            </label>
            <div className="mt-2">
              <select
                {...getSelectProps(fields.role)}
                className={fields.role.errors ? "select select-error w-full" : "select select-bordered w-full"}
                key={fields.role.key}
              >
                {roles.map(option => (
                  <option key={option.id} value={option.id}>{ option.text }</option>
                ))}
              </select>
            </div>
            {fields.role.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.role.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.password.id}>
              {t("content.password")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.password, { type: "password" })}
                className={`${
                  fields.password.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.password.key}
              />
            </div>
            {fields.password.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.password.errors}</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={fields.passwordRe.id}>
              {t("content.passwordRe")}
            </label>
            <div className="mt-2">
              <Input
                {...getInputProps(fields.passwordRe, { type: "password" })}
                className={`${
                  fields.passwordRe.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                  }`}
                key={fields.passwordRe.key}
              />
            </div>
            {fields.passwordRe.errors && (
              <div className="label">
                <span className="label-text-alt text-error">{fields.passwordRe.errors}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="btn btn-primary btn-wide"
              disabled={isSubmitting()}
              type="submit"
            >
              {isSubmitting() ? (<span className="loading loading-spinner" />) : null}
              {isSubmitting() ? t("content.processing") : t("content.signUpBtn")}
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
    </main>
  )
}
