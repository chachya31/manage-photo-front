/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable spellcheck/spell-checker */
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useTranslation } from 'react-i18next'
import { Form, Link, useNavigation, type MetaFunction } from 'react-router'

import type { Route } from './+types/login'

import { Alert, AlertDescription } from '~/components/ui/alert'
import { Input } from '~/components/ui/input'
import { PAGE_URL } from '~/constants/pageUrl'
import { loginAction } from '~/state/auth/login/action'
import { createLoginSchema } from '~/state/auth/login/schema'
import { loginCheckLoader } from '~/state/common/commonLoader'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App Login' },
    { name: 'description', content: 'Welcome to React Router Login!' },
  ]
}

export const loader = loginCheckLoader
export const action = loginAction

export default function Login({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const schema = createLoginSchema()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const flashMessage = loaderData?.flashMessage?.message

  const isSubmitting = () => {
    return navigation.formAction === PAGE_URL.LOGIN
  }

  const AlertDiv = (props: { text: string }) => {
    const properties = props
    return (
      <Alert className="alert-success">
        <AlertDescription className="flex flex-row items-center gap-2 justify-between">
          <span>{properties.text}</span>
          <button className="btn btn-circle btn-ghost btn-xs">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <div className="hero bg-base-200 max-h-screen">
      <div className="hero justify-items-center">
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
          <div className="hero-content">
            <h1 className="text-2xl font-bold">{t('pageTitle.login')}</h1>
          </div>

          {flashMessage && <AlertDiv text={flashMessage} />}

          <Form className="card-body" method="post" {...getFormProps(form)}>
            <div className="form-control">
              <label className="label" htmlFor={fields.email.id}>
                <span className="label-text">{t('content.mailAddress')}</span>
              </label>
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                autoComplete="email"
                className={`${
                  fields.email.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
              />
              {fields.email.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.email.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <div className="flex items-center justify-between">
                <label className="label" htmlFor={fields.password.id}>
                  <span className="label-text">{t('content.password')}</span>
                </label>
              </div>
              <Input
                {...getInputProps(fields.password, { type: 'password' })}
                autoComplete="current-password"
                className={`${
                  fields.password.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
              />
              {fields.password.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.password.errors}
                  </span>
                </div>
              )}
              <label className="label">
                <Link
                  className="label-text-alt link link-hover"
                  to={PAGE_URL.FORGOT_PASSWORD}
                >
                  {t('content.forgotPasswordLink')}
                </Link>
              </label>
            </div>

            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                disabled={isSubmitting()}
                type="submit"
              >
                {isSubmitting() ? (
                  <span className="loading loading-spinner" />
                ) : null}
                {isSubmitting()
                  ? t('content.processing')
                  : t('content.loginBtn')}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link
                className="font-semibold link link-info link-hover"
                to={PAGE_URL.SIGN_UP}
              >
                {t('content.signUpLink')}
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
    </div>
  )
}
