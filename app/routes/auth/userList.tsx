/* eslint-disable react/function-component-definition */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { useTranslation } from 'react-i18next'
import { Form, LoaderFunctionArgs } from 'react-router'

import { Route } from './+types/userList'

import { getUserId } from '~/services/session.server'
import { Apis } from '~/utils/apis'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const res = await Apis.get('/auth/list', null)
  return { userId: userId, userList: res }
}

export default function UserList({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { userId, userList } = loaderData
  return (
    <div>
      <Form method="get" role="search">
        <button className="btn btn-outline" type="submit">
          検索
        </button>
      </Form>
      {userList ? (
        <table className="table">
          <thead>
            <tr>
              <th>{t('content.mailAddress')}</th>
              <th>{t('content.userName')}</th>
              <th>{t('content.phoneNumber')}</th>
              <th>{t('content.verifyAccount')}</th>
              <th>{t('content.role')}</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr
                className={user.email === userId ? 'bg-base-200' : ''}
                key={user.email}
              >
                <th>{user.email}</th>
                <td>{user.name}</td>
                <td>{user.phone_number}</td>
                <td>{user.email_verified}</td>
                <td>{user['custom:role']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span>test!</span>
      )}
    </div>
  )
}
