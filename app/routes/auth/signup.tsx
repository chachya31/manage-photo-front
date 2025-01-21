/* eslint-disable spellcheck/spell-checker */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable react/function-component-definition */
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useTranslation } from 'react-i18next'
import { Form, Link, useNavigation, type MetaFunction } from 'react-router'

import type { Route } from './+types/signup'

import { Input } from '~/components/ui/input'
import { PAGE_URL } from '~/constants/pageUrl'
import { roles } from '~/state/auth'
import { signUpAction } from '~/state/auth/signup/action'
import { createSignUpSchema } from '~/state/auth/signup/schema'
import { loginCheckLoader } from '~/state/common/commonLoader'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App Login' },
    { name: 'description', content: 'Welcome to React Router Login!' },
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
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  const isSubmitting = () => {
    return navigation.formAction === PAGE_URL.SIGN_UP
  }
  return (
    <div className="hero bg-base-200 max-h-screen">
      <div className="hero justify-items-center">
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
          <div className="hero-content">
            <h1 className="text-2xl font-bold">{t('pageTitle.signUp')}</h1>
          </div>

          <Form className="card-body" method="post" {...getFormProps(form)}>
            <div className="form-control">
              <label className="label" htmlFor={fields.email.id}>
                <span className="label-text">{t('content.mailAddress')}</span>
              </label>
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                className={`${
                  fields.email.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.email.key}
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
              <label className="label" htmlFor={fields.full_name.id}>
                <span className="label-text">{t('content.userName')}</span>
              </label>
              <Input
                {...getInputProps(fields.full_name, { type: 'text' })}
                className={`${
                  fields.full_name.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.full_name.key}
              />
              {fields.full_name.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.full_name.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.phone_number.id}>
                <span className="label-text">{t('content.phoneNumber')}</span>
              </label>
              <Input
                {...getInputProps(fields.phone_number, { type: 'tel' })}
                className={`${
                  fields.phone_number.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.phone_number.key}
              />
              {fields.phone_number.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.phone_number.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.role.id}>
                <span className="label-text">{t('content.role')}</span>
              </label>
              <select
                {...getSelectProps(fields.role)}
                className={
                  fields.role.errors
                    ? 'select select-error w-full'
                    : 'select select-bordered w-full'
                }
                key={fields.role.key}
              >
                {roles.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
              {fields.role.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.role.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.password.id}>
                <span className="label-text">{t('content.password')}</span>
              </label>
              <Input
                {...getInputProps(fields.password, { type: 'password' })}
                className={`${
                  fields.password.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.password.key}
              />
              {fields.password.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.password.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.passwordRe.id}>
                <span className="label-text">{t('content.passwordRe')}</span>
              </label>
              <Input
                {...getInputProps(fields.passwordRe, { type: 'password' })}
                className={`${
                  fields.passwordRe.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.passwordRe.key}
              />
              {fields.passwordRe.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.passwordRe.errors}
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
                  : t('content.signUpBtn')}
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
