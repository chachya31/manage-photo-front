import { z } from 'zod'

export const createVerifyAccountSchema = () => {
  return z
    .object({
      email: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "メールアドレスを入力してください。" })
          .email("メールアドレス形式ではありません。"),
      ),
      confirmation_code: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
          .string({ required_error: "認証コードを入力してください。" })
      )
    })
}