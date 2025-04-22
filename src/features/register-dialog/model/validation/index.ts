import { z } from 'zod'

export const registrationSchema = z
  .object({
    name: z
      .string()
      .nonempty('Поле не заполнено')
      .min(2, 'Некорректные данные ')
      .max(255, 'Некорректные данные')
      .regex(/^[A-Za-zА-Яа-яЁё\s\-"'']+$/, 'Некорректные данные'),

    company: z
      .string()
      .max(255, 'Некорректные данные')
      .optional()
      .refine(
        value =>
          value === undefined ||
          value.trim() === '' ||
          /^[A-Za-zА-Яа-яЁё0-9\s\-"'']+$/.test(value),
        'Некорректные данные'
      ),

    phone: z
      .string()
      .nonempty('Поле не заполнено')
      .transform(value => value.replace(/\D/g, ''))
      .refine(
        value => value.length >= 10 && value.length <= 15,
        'Некорректные данные'
      ),
    email: z
      .string()
      .nonempty('Поле не заполнено')
      .email('Некорректные данные')
      .regex(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        'Некорректные данные'
      )
      .min(5, 'Некорректные данные')
      .max(255, 'Некорректные данные'),

    password: z
      .string()
      .nonempty('Поле не заполнено')
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .max(16, 'Некорректные данные')
      .regex(
        /^(?:[A-Za-z]+|[0-9]+|[A-Za-z0-9]*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+[A-Za-z0-9]*){8,16}$/,
        'Некорректные данные'
      ),

    confirmPassword: z.string().nonempty('Поле не заполнено'),

    agreement: z.boolean().refine(val => val === true, {
      message: ' '
    })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Пароли не совпадают',
        code: z.ZodIssueCode.custom
      })
    }
  })
