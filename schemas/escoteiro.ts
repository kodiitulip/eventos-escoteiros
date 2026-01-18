import { z } from 'zod';

const scoutBranches = ['lobinho', 'escoteiro', 'senior', 'pioneiro'] as const;

export const ScoutBranchesSchema = z.enum(scoutBranches, 'Deve-se escolher um ramo para o escoteiro');
export type ScoutBranches = z.infer<typeof ScoutBranchesSchema>;

export const ScoutDataSchema = z.object({
  nome: z
    .string()
    .nonempty('Nome muito pequeno, requer ao menos 1 letra')
    .nonoptional('Deve incluir o nome do escoteiro'),
  responsavel: z.string().optional(),
  ramo: ScoutBranchesSchema,
  telefone: z.string().nonempty().nonoptional('Preencha as informações de contato'),
  endereco: z.string().nonempty().nonoptional('Preencha as informações de contato'),
});
export type ScoutData = z.infer<typeof ScoutDataSchema>;
export type ScoutDataInput = z.input<typeof ScoutDataSchema>;
export type ScoutDataOutput = z.output<typeof ScoutDataSchema>;
