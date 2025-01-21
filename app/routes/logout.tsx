import { type MetaFunction } from 'react-router'
import { redirect } from 'react-router'

import { logout } from '../services/session.server'

import type * as Route from './+types.logout'

import { PAGE_URL } from '~/constants/pageUrl'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App Logout' },
    { name: 'description', content: 'Welcome to React Router Logout!' },
  ]
}

export const action = async ({ request }: Route.ActionArgs) => {
  return logout(request)
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const loader = async ({ request }: Route.LoaderArgs) => {
  return redirect(PAGE_URL.LOGIN)
}
