import { z } from 'zod'

import { Role } from '..'

export const createSignUpSchema = () => {
  return z
    .object({
      email: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "メールアドレスを入力してください。" })
          .email("メールアドレス形式ではありません。")
      ),
    })
    .and(
      z.object({
        full_name: z.preprocess(
          (value) => (value === '' ? undefined : value),
          z
            .string({ required_error: "ユーザ名を入力してください。" }),
        ),
        phone_number: z.preprocess(
          (value) => (value === '' ? undefined : value),
          z
            .string({ required_error: "電話番号を入力してください。" }),
        ),
      })
    )
    .and(
      z
        .object({
          password: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z
              .string({ required_error: "パスワードを入力してください。" }),
          ),
          passwordRe: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z
              .string({ required_error: "パスワードを入力してください。" }),
          ),
        })
        .refine((data) => data.password === data.passwordRe, {
          message: "パスワードが一致していません。",
          path: ["passwordRe"]
        })
    )
    .and(
      z
        .object({
          role: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z
              .string({ required_error: "権限を選択してください。" })
          ),
        })
        .refine((data) => Object.values(Role).includes(data.role as Role), {
          message: '存在しない権限です。',
          path: ['role']
        })
    )
}
