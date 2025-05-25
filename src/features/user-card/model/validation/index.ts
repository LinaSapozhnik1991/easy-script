import { z } from 'zod'

export const userSchema = z.object({
  //id: z.string(),
  name: z
    .string()
    .nonempty('Поле не заполнено')
    .min(2, 'Некорректные данные')
    .max(255, 'Некорректные данные')
    .regex(/^[A-Za-zА-Яа-яЁё\s\-"'']+$/, 'Некорректные данные'),
  phone: z
    .string()
    .nonempty('Поле не заполнено')
    .transform(value => value.replace(/\D/g, ''))
    .refine(
      value => value.length >= 10 && value.length <= 15,
      'Некорректные данные'
    ),
  whatsapp: z
    .string()
    .optional()
    .refine(
      value =>
        value === undefined ||
        value === '' ||
        (value.length >= 10 && value.length <= 15),
      'Некорректные данные'
    ),

  telegram: z
    .string()
    .optional()
    .refine(
      value =>
        value === undefined ||
        value === '' ||
        /^@?[A-Za-z0-9_]{5,255}$/.test(value),
      'Некорректные данные'
    ),
  email: z.string().email('Некорректный email'),
  company: z.string().optional()
})
export type User = z.infer<typeof userSchema>
