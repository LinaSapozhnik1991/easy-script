import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Поле не заполнено')
    .min(5, 'Некорректные данные')
    .max(255, 'Некорректные данные')
    .email('Некорректные данные'),

  password: z
    .string()
    .nonempty('Поле не заполнено')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(16, 'Некорректные данные')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/, 'Некорректные данные')
})
