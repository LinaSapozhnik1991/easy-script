import { z } from 'zod'

export const scriptSchema = z.object({
  scriptName: z
    .string()
    .nonempty('Поле не заполнено')
    .min(2, 'Некорректные данные ')
    .max(255, 'Некорректные данные')
    .regex(/^[A-Za-zА-Яа-яЁё\s\-"'']+$/, 'Некорректные данные'),
  selectedCompanyId: z.string().min(1, 'Выберите компанию')
})
