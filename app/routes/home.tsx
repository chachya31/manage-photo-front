/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { useTranslation } from 'react-i18next'
import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  type MetaFunction,
} from 'react-router'

// import { Welcome } from "../welcome/welcome";

import type { Route } from './+types/home'

import { PAGE_URL } from '~/constants/pageUrl'
import { getUserId, getAccessToken, logout } from '~/services/session.server'
import { verifyToken } from '~/services/verify.token'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await getUserId(request)
  const accessToken = await getAccessToken(request)
  if (!userId || !accessToken) {
    throw redirect(PAGE_URL.LOGIN)
  } else {
    return { userId: userId, accessToken: accessToken }
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = logout(request)
  throw response
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const getJwt = () => async () => {
    console.log('accessToken:', loaderData.accessToken)
    const test = await verifyToken(loaderData.accessToken)
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to React Router v7 Auth</h1>
      <div className="mt-6">
        {loaderData?.userId ? (
          <div>
            <p className="mb-6">You are logged in {loaderData?.userId}</p>
            <Form action="/logout" method="post">
              <button className="border rounded px-2.5 py-1" type="submit">
                {t('logoutBtn')}
              </button>
            </Form>
            <button className="btn" onClick={getJwt()} type="button">
              토큰 확인
            </button>
            <Form action="/refresh_token" method="post">
              <button className="border rounded px-2.5 py-1" type="submit">
                {t('refreshTokenBtn')}
              </button>
            </Form>
          </div>
        ) : (
          <Link to={PAGE_URL.LOGIN}>Login</Link>
        )}
      </div>
    </div>
  )
}
