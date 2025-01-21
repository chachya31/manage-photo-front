/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { useTranslation } from 'react-i18next'
import { Form, Link, Outlet, redirect, type MetaFunction } from 'react-router'

import type { Route } from './+types/home'

import { API_URL } from '~/constants/apiUrl'
import { PAGE_URL } from '~/constants/pageUrl'
import { getUserId, getAccessToken } from '~/services/session.server'
import { verifyToken } from '~/services/verify.token'
import { Apis } from '~/utils/apis'

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
    const res = await Apis.getUserDetail(API_URL.USER_DETAIL, { email: userId })
    return { accessToken: accessToken, user: res }
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const getJwt = () => async () => {
    await verifyToken(loaderData.accessToken)
  }
  const user = loaderData.user
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to React Router v7 Auth</h1>
      <div className="mt-6">
        {user ? (
          <div>
            <p className="mb-4">You are logged in {user.email}</p>
            <p className="mb-2">・ {user.email}</p>
            <p className="mb-2">・ {user.name}</p>
            <p className="mb-2">・ {user.phone_number}</p>
            <p className="mb-2">・ {user['custom:role']}</p>
            <div className="mb-4 flex justify-normal">
              <Form action={PAGE_URL.LOGOUT} method="post">
                <button className="btn btn-primary btn-sm" type="submit">
                  {t('content.logoutBtn')}
                </button>
              </Form>
              <button
                className="btn btn-info btn-sm btn-outline"
                onClick={getJwt()}
                type="button"
              >
                토큰 확인
              </button>
              <Form action={PAGE_URL.REFRESH_TOKEN} method="post">
                <button
                  className="btn btn-accent btn-sm btn-outline"
                  type="submit"
                >
                  {t('content.refreshTokenBtn')}
                </button>
              </Form>
            </div>
            <Outlet />
          </div>
        ) : (
          <Link to={PAGE_URL.LOGIN}>Login</Link>
        )}
      </div>
    </div>
  )
}
