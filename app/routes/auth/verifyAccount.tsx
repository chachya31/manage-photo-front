/* eslint-disable spellcheck/spell-checker */
/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useTranslation } from 'react-i18next'
import {
  Form,
  type MetaFunction,
  useNavigate,
  useNavigation,
} from 'react-router'

import type { Route } from './+types/verifyAccount'

import { Input } from '~/components/ui/input'
import { API_URL } from '~/constants/apiUrl'
import { PAGE_URL } from '~/constants/pageUrl'
import { verifyAccountAction } from '~/state/auth/verifyAccount/action'
import { createVerifyAccountSchema } from '~/state/auth/verifyAccount/schema'
import { tempLoginCheckLoader } from '~/state/common/commonLoader'
import { Apis } from '~/utils/apis'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App Verify' },
    { name: 'description', content: 'Welcome to React Router Verify!' },
  ]
}

const schema = createVerifyAccountSchema()

export const loader = tempLoginCheckLoader
export const action = verifyAccountAction

export default function VerifyAccount({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const isSubmitting = () => {
    return navigation.formAction === PAGE_URL.VERIFY_ACCOUNT
  }
  const email = loaderData.email
  // 認証コード期限切れモーダル
  const ResendModal = (props: { open: boolean }) => {
    const properties = props
    return (
      <dialog className="modal" id="my_modal_1" open={properties.open}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">期限切れ！</h3>
          <p className="py-4">認証コードの有効期限が切れました。</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={resendConfirmationCode()}>
                再発行
              </button>
            </form>
          </div>
        </div>
      </dialog>
    )
  }
  // 認証コード再送信
  const resendConfirmationCode = () => async () => {
    try {
      const formData = new FormData()
      formData.append('email', email)
      const res = await Apis.postForm(
        API_URL.RESEND_CONFIRMATION_CODE,
        formData
      )

      if (res.status !== 200) {
        throw new Error(`Login Failed: ${res.data.detail[0].msg}`)
      }
      navigate('/login')
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message }
      }
      return { error: 'An unknown error occurred' }
    }
  }
  // レンダリング
  return (
    <div className="hero bg-base-200 max-h-screen">
      <div className="hero justify-items-center">
        <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
          <div className="hero-content">
            <h1 className="text-2xl font-bold">
              {t('pageTitle.verifyAccount')}
            </h1>
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
                readOnly={email ? true : false}
                value={email}
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
              <label className="label" htmlFor={fields.confirmation_code.id}>
                <span className="label-text">
                  {t('content.confirmationCode')}
                </span>
              </label>
              <Input
                {...getInputProps(fields.confirmation_code, { type: 'text' })}
                className={`${
                  fields.confirmation_code.errors
                    ? 'outline outline-red-500 focus-visible:ring-red-500'
                    : ''
                }`}
              />
              {fields.confirmation_code.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.confirmation_code.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control mt-6 items-center">
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
                  : t('content.verifyAccountBtn')}
              </button>
            </div>

            {actionData?.error ? (
              <div className="flex flex-row">
                <p className="text-red-600 mt-4 ">{actionData?.error}</p>
              </div>
            ) : null}
          </Form>
        </div>
        {actionData?.modal && <ResendModal open={actionData.modal} />}
      </div>
    </div>
  )
}
