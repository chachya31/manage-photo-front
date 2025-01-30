/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useTranslation } from "react-i18next"
import { ActionFunctionArgs, Form, Link, LoaderFunctionArgs, redirect, useNavigation } from "react-router"
import { z } from "zod"

import type { Route } from './+types/addMovie'

import { Input } from "~/components/ui/input"
import { Rating } from "~/components/ui/rating"
import { API_URL } from "~/constants/apiUrl"
import { PAGE_URL } from "~/constants/pageUrl"
import { getAccessToken, getUserId } from "~/services/session.server"
import { ratingList } from "~/state/movie"
import { Apis } from "~/utils/apis"


export const addMovieSchema = () => {
  return z
    .object({
      year: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .number({ required_error: "発売年度を入力してください。", invalid_type_error: "数字じゃない！" })
      ),
      title: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "タイトルを入力してください。"})
      ),
      plot: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "タイトルを入力してください。"})
      ),
      rating: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .number({ invalid_type_error: "数字じゃない！" })
      ),
    })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const accessToken = await getAccessToken(request)
  if (!userId || !accessToken) {
    throw redirect(PAGE_URL.LOGIN)
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let response: Response
  try {
    const accessToken = await getAccessToken(request)
    const schema = addMovieSchema()
    const formData = await request.formData()
    const submission = await parseWithZod(formData, { schema })

    if (submission.status !== "success") {
      return submission.reply()
    }
    console.log(submission.payload)

    const res = await Apis.put(API_URL.ADD_MOVIE, submission.payload, accessToken)
    if (res.status !== 201) {
      throw new Error(`Failed: ${res.data.detail[0].msg}`)
    }
    response = redirect(PAGE_URL.MOVIE_LIST)
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "An unknown error occurred" }
  }
  throw response
}

export default function CreateMovie({ actionData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const schema = addMovieSchema()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    // eslint-disable-next-line spellcheck/spell-checker
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
            <h1 className="text-2xl font-bold">映画登録</h1>
          </div>

          <Form className="card-body" method="put" {...getFormProps(form)}>
            <div className="form-control">
              <label className="label" htmlFor={fields.year.id}>
                <span className="label-text">公開年度</span>
              </label>
              <Input
                {...getInputProps(fields.year, { type: 'number' })}
                className={`${
                  fields.year.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.year.key}
              />
              {fields.year.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.year.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.title.id}>
                <span className="label-text">タイトル</span>
              </label>
              <Input
                {...getInputProps(fields.title, { type: 'text' })}
                className={`${
                  fields.title.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.title.key}
              />
              {fields.title.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.title.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.plot.id}>
                <span className="label-text">プロット</span>
              </label>
              <Input
                {...getInputProps(fields.plot, { type: 'text' })}
                className={`${
                  fields.plot.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
                key={fields.plot.key}
              />
              {fields.plot.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.plot.errors}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor={fields.rating.id}>
                <span className="label-text">評価</span>
              </label>
              <div className="rating rating-lg rating-half">
                {ratingList.map((score, i) => (
                  <Rating
                    {...getInputProps(fields.rating, { type: "radio" })}
                    className={
                      score === 0 ? "rating-hidden"
                      : i % 2 !== 0
                      ? "mask mask-heart mask-half-1 bg-red-400"
                      : "mask mask-heart mask-half-2 bg-red-400"
                    }
                    key={`${fields.rating.key}:${score}`}
                    value={score}
                  />
                ))}
              </div>
              {fields.rating.errors && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {fields.rating.errors}
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
                  : "映画登録"}
              </button>

              <Link
                to={PAGE_URL.ROUTE}
              >
                <button className="btn btn-outline" type="button">
                  TOPへ
                </button>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
  
}
