import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "名前を入力してください")
      .max(255, "名前は255文字以内で入力してください"),
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスを入力してください")
      .email("メールアドレスの形式で入力してください")
      .max(255, "メールアドレスは255文字以内で入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(255, "パスワードは255文字以内で入力してください"),
    passwordConfirmation: z.string().min(1, "確認用パスワードを入力してください"),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "パスワードが一致しません",
    path: ["passwordConfirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
