import { z } from "zod"

export const createConfirmForgotPasswordSchema = () => {
  return z
    .object({
      email: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "メールアドレスを入力してください。" })
          .email("メールアドレス形式ではありません。")
      ),
      confirmation_code: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "認証コードを入力してください。" })
      )
    })
    .and(
      z
        .object({
          new_password: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z
              .string({ required_error: "パスワードを入力してください。" }),
          ),
          new_password_re: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z
              .string({ required_error: "パスワード（確認）を入力してください。" }),
          ),
        })
        .refine((data) => data.new_password === data.new_password_re, {
          message: "パスワードが一致していません。",
          path: ["new_password_re"]
        })
    )
}