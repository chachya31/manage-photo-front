/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { useTranslation } from 'react-i18next'
import { Form, LoaderFunctionArgs, redirect } from 'react-router'

import type { Route } from './+types/movieList'

import { PAGE_URL } from '~/constants/pageUrl'
import { getAccessToken, getUserId } from '~/services/session.server'
import { Apis } from '~/utils/apis'


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const accessToken = await getAccessToken(request)
  if (!userId || !accessToken) {
    throw redirect(PAGE_URL.LOGIN)
  } else {
    // const res = await Apis.getWithToken("/movie/list", { year: params.year }, accessToken)
    return { movieList: [] }
  }
}


export default function MovieList({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { movieList } = loaderData
  return (
    <div>
      <Form method="get" role="search">
        <button className="btn btn-sm btn-outline" type="submit">
          {t('content.userListBtn')}
        </button>
      </Form>
      {movieList ? (
        <div>abc</div>
      ) : (
        <span>test!</span>
      )}
    </div>
  )
}