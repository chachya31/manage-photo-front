import { z } from "zod"

export const createLoginSchema = () => z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください。" })
    .email("メールアドレス形式ではありません。"),
  password: z
    .string({ required_error: "パスワードを入力してください。" }),
})