import { z } from "zod"

export const createForgotPasswordSchema = () => z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください。" })
    .email("メールアドレス形式ではありません。")
})