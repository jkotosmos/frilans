import { z } from "zod";

// Deliberately generic message: never reveal whether the email exists.
export const AUTH_GENERIC_ERROR = "Неверный email или пароль";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(60, "Слишком длинное имя"),
  email: z.string().trim().toLowerCase().email("Введите корректный email").max(255),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(200)
    .regex(/[a-zA-Zа-яА-Я]/, "Пароль должен содержать хотя бы одну букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
  role: z.enum(["CLIENT", "FREELANCER"]).default("CLIENT"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
