/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable react/function-component-definition */

import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useTranslation } from "react-i18next"
import { Form, Link, LoaderFunctionArgs, NavLink, Outlet, redirect, useNavigation, useSubmit } from "react-router"

import { z } from "zod"

import type { Route } from './+types/sidebar'

import { Input } from "~/components/ui/input"
import { PAGE_URL } from "~/constants/pageUrl"
import { getAccessToken, getUserId } from "~/services/session.server"
import { Apis } from "~/utils/apis"


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const accessToken = await getAccessToken(request)
  if (!userId || !accessToken) {
    throw redirect(PAGE_URL.LOGIN)
  } else {
    console.log("sidebar.year:", params.year)
    const res = await Apis.getWithToken("/movie/list", { year: params.year }, accessToken)
    console.log(res)
    return { movieList: res }
  }
}

export const createSearchMovieSchema = () => z.object({
  year: z
    .string({ required_error: "年度を入力してください。" })
})


export default function MovieSidebar({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const schema = createSearchMovieSchema()
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    // eslint-disable-next-line spellcheck/spell-checker
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  const { movieList } = loaderData

  const searching = navigation.location
  // && new URLSearchParams(navigation.location.search).has("q")

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-none gap-2">
          <Form
            className="card-body"
            method="get"
            role="search"
            {...getFormProps(form)}
          >
            <div className="form-control">
              <Input
                {...getInputProps(fields.year, { type: 'search' })}
                className={`${
                  fields.year.errors
                    ? 'input input-bordered input-error w-full'
                    : ''
                }`}
              />
              <div aria-hidden hidden={!searching} id="search-spinner" />
            </div>
          </Form>
        </div>
        <NavLink to="movies/create">登録</NavLink>
      </div>
      <div className="navbar bg-base-100">
        <div className="flex-none gap-2">
          {movieList.length ? (
            <ul
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              tabIndex={0}
            >
              {movieList.map((movie) => (
                <li key={movie.year}>
                  {movie.title}
                </li>
              ))}
            </ul>
          ) : (
            <p><i>Movieなし</i></p>
            )}
          </div>
      </div>
      <div
        className={navigation.state === "loading" && !searching ? "loading" : ""}
        id="detail"
      >
        <Outlet />
      </div>
    </>
  )
}