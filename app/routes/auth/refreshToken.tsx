/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ActionFunctionArgs, redirect } from 'react-router'

import type { Route } from './+types/refreshToken'

import { API_URL } from '~/constants/apiUrl'
import { PAGE_URL } from '~/constants/pageUrl'
import {
  createUserSession,
  getRefreshToken,
  getUserId,
} from '~/services/session.server'
import { Apis } from '~/utils/apis'

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request)
  const refreshToken = await getRefreshToken(request)
  if (!userId || !refreshToken) {
    throw redirect(PAGE_URL.LOGIN)
  }
  const res = await Apis.post(API_URL.NEW_TOKEN, {
    refresh_token: refreshToken,
  })
  if (res.status !== 200) {
    throw new Error(`Refresh Token Failed: ${res.data.detail[0].msg}`)
  } else {
    const accessToken = res.data.AccessToken
    const response = await createUserSession({
      request,
      userId,
      accessToken,
      refreshToken,
      remember: true,
    })
    throw response
  }
}
