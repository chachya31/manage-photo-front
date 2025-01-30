/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable react/function-component-definition */

import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useTranslation } from "react-i18next"
import { Form, Link, NavLink, Outlet, redirect, useNavigation, useSubmit } from "react-router"
import { z } from "zod"

import type { Route } from './+types/sidebar'

import { Input } from "~/components/ui/input"
import { API_URL } from "~/constants/apiUrl"
import { PAGE_URL } from "~/constants/pageUrl"
import { getAccessToken, getUserId } from "~/services/session.server"
import { Movie } from "~/state/movie"
import { Apis } from "~/utils/apis"


export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await getUserId(request)
  const accessToken = await getAccessToken(request)
  if (!userId || !accessToken) {
    throw redirect(PAGE_URL.LOGIN)
  } else {
    const url = new URL(request.url)
    const year = url.searchParams.get("year")
    let res = null
    if (year) {
      res = await Apis.getWithToken(API_URL.QUERY_MOVIES, accessToken, null, { year: year })
    } else {
      res = await Apis.getWithToken(API_URL.GET_MOVIE_LIST, accessToken)
    }
    return { movieList: res }
  }
}

export const createSearchMovieSchema = () => z.object({
  year: z.string({})
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
  })

  const { movieList } = loaderData

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("year")

  return (
    <>
      <div className="navbar bg-base-100">
        <Form
          action={PAGE_URL.MOVIE_LIST}
          method="get"
          role="search"
          {...getFormProps(form)}
        >
          <div className="join">
            <Input
              {...getInputProps(fields.year, { type: 'search' })}
              className={`${
                fields.year.errors
                  ? 'input input-bordered join-item input-error w-full'
                  : 'input input-bordered join-item'
              }`}
            />
            <div className="indicator">
              <button className="btn btn-outline join-item">検索</button>
              <div aria-hidden hidden={!searching} id="search-spinner" />
            </div>
          </div>
        </Form>
      </div>
      <div className="flex justify-start">
        <Link to={PAGE_URL.ADD_MOVIE}>
          <button className="btn btn-info" type="button">
            登録
          </button>
        </Link>
        <Link to={PAGE_URL.ROUTE} >
          <button className="btn btn-outline btn-neutral" type="button">
            トップへ
          </button>
        </Link>
      </div>
      <div className="divider divider-neutral" />
      <div className="flex w-full">
        <div style={{width: "25%"}}>
          <div className="drawer lg:drawer-open">
            {movieList.length ? (
              <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
                {movieList.map((movie: Movie) => (
                  <li key={`${movie.year}-${movie.title}`}>
                    <NavLink
                      className={({ isActive, isPending}) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`movies/${movie.year}/${movie.title}/edit`}
                    >
                      {movie.title}
                    </NavLink>
                    <button className="btn btn-outline btn-error" type="button">
                      削除
                    </button>
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
      </div>
    </>
  )
}