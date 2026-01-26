import { z } from 'zod';

export const RegisterSchema = z
  .object({
    email: z.email({ error: 'Email deve ser válido' }).nonoptional(),
    password: z.string().min(6, { error: 'Senha deve conter ao menos 6 caracteres' }),
    confirmPassword: z.string().min(6, { error: 'Senha deve conter ao menos 6 caracteres' }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password)
      ctx.addIssue({
        code: 'custom',
        message: 'Senhas não são equivalentes',
        path: ['confirmPasswd'],
      });
  });

export type RegisterData = z.infer<typeof RegisterSchema>;
export type RegisterDataInput = z.input<typeof RegisterSchema>;
export type RegisterDataOutput = z.output<typeof RegisterSchema>;
