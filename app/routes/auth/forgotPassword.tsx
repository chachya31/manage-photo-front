/* eslint-disable spellcheck/spell-checker */
/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useTranslation } from 'react-i18next'
import { Form, Link, useNavigation, type MetaFunction } from 'react-router'

import type { Route } from './+types/forgotPassword'

import { Input } from '~/components/ui/input'
import { PAGE_URL } from '~/constants/pageUrl'
import { forgotPasswordAction } from '~/state/auth/forgotPassword/action'
import { createForgotPasswordSchema } from '~/state/auth/forgotPassword/schema'
import { loginCheckLoader } from '~/state/common/commonLoader'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App Forget Password' },
    { name: 'description', content: 'Welcome to React Router Login!' },
  ]
}

export const loader = loginCheckLoader
export const action = forgotPasswordAction

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const schema = createForgotPasswordSchema()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const isSubmitting = () => {
    return navigation.formAction === PAGE_URL.FORGOT_PASSWORD
  }
  return (
    <div className="hero bg-base-200 max-h-screen">
      <div className="hero justify-items-center">
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
          <div className="hero-content">
            <h1 className="text-2xl font-bold">
              {t('content.passwordResetMessage')}
            </h1>
          </div>

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

            <div className="flex mt-6 items-center justify-between">
              <button
                className="btn btn-primary btn-wide"
                disabled={isSubmitting()}
                type="submit"
              >
                {isSubmitting() ? (
                  <span className="loading loading-spinner" />
                ) : null}
                {isSubmitting()
                  ? t('content.processing')
                  : t('content.passwordResetBtn')}
              </button>

              <Link
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                to={PAGE_URL.LOGIN}
              >
                <button className="btn btn-outline" type="button">
                  {t('content.loginLink')}
                </button>
              </Link>
            </div>

            {actionData?.error ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {actionData?.error}
                </span>
              </div>
            ) : null}
          </Form>
        </div>
      </div>
    </div>
  )
}
