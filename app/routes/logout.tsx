import { type MetaFunction } from 'react-router'
import { redirect } from 'react-router'

import { getAccessToken, logout } from '../services/session.server'

import type { Route } from './+types/logout'

import { API_URL } from '~/constants/apiUrl'
import { PAGE_URL } from '~/constants/pageUrl'
import { Apis } from '~/utils/apis'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App Logout' },
    { name: 'description', content: 'Welcome to React Router Logout!' },
  ]
}

export const action = async ({ request }: Route.ActionArgs) => {
  const accessToken = await getAccessToken(request)
  await Apis.post(API_URL.LOGOUT, {
    access_token: accessToken,
  })
  return logout(request)
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const loader = async ({ request }: Route.LoaderArgs) => {
  return redirect(PAGE_URL.LOGIN)
}
