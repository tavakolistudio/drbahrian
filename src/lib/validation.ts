import { z } from 'zod'

export const ReservationSchema = z.object({
  slotId: z.string().min(1, 'شناسه وقت الزامی است'),
  fullName: z.string().min(2, 'نام کامل الزامی است').max(100),
  country: z.string().min(1, 'کشور الزامی است'),
  city: z.string().min(1, 'شهر الزامی است').max(100),
  timezone: z.string().min(1, 'منطقه زمانی الزامی است'),
  whatsapp: z
    .string()
    .min(7, 'شماره واتساپ الزامی است')
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, 'فرمت شماره صحیح نیست'),
  telegram: z.string().max(50).optional().or(z.literal('')),
  bale: z.string().max(50).optional().or(z.literal('')),
  preferredContactMethod: z.enum(['WHATSAPP', 'TELEGRAM', 'BALE'], {
    errorMap: () => ({ message: 'روش ارتباطی الزامی است' }),
  }),
  appointmentMode: z.enum(['ONLINE', 'IN_PERSON'], {
    errorMap: () => ({ message: 'نوع جلسه الزامی است' }),
  }),
  clientType: z.enum(['NEW', 'RETURNING'], {
    errorMap: () => ({ message: 'نوع مراجع الزامی است' }),
  }),
  topic: z.string().min(1, 'موضوع الزامی است'),
  note: z.string().max(500).optional().or(z.literal('')),
})

export type ReservationInput = z.infer<typeof ReservationSchema>

export const AdminLoginSchema = z.object({
  email: z.string().email('ایمیل معتبر وارد کنید'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
})

export const CreateSlotSchema = z.object({
  iranDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تاریخ صحیح نیست'),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  durationMin: z.number().int().min(10).max(180),
  breakMin: z.number().int().min(0).max(60),
  appointmentMode: z.enum(['ONLINE', 'IN_PERSON', 'BOTH']),
})

export const BulkCreateSlotsSchema = z.object({
  slots: z.array(
    z.object({
      startTimeUtc: z.string().datetime(),
      endTimeUtc: z.string().datetime(),
      appointmentMode: z.enum(['ONLINE', 'IN_PERSON', 'BOTH']),
    })
  ).min(1).max(50),
})

export const UpdateSlotSchema = z.object({
  status: z.enum(['LOCKED', 'AVAILABLE', 'CANCELLED']).optional(),
  appointmentMode: z.enum(['ONLINE', 'IN_PERSON', 'BOTH']).optional(),
})

export const AdminActionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'CANCEL']),
  adminNote: z.string().max(500).optional(),
})

export const SettingsSchema = z.object({
  doctorTimezone: z.string().min(1),
  defaultSlotDurationMinutes: z.number().int().min(10).max(180),
  defaultBreakMinutes: z.number().int().min(0).max(60),
  pendingExpirationHours: z.number().int().min(1).max(168),
})
