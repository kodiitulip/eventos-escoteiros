import { z } from 'zod';

const scoutBranches = ['lobinho', 'escoteiro', 'senior', 'pioneiro'] as const;
const eventScoutBranches = ['geral', 'lobinho', 'escoteiro', 'senior', 'pioneiro'] as const;
const paymentStatus = ['pendente', 'pago', 'isento'] as const;

export const ScoutBranchesEnum = z.enum(scoutBranches, 'Deve-se escolher um ramo para o escoteiro');
export const EventScoutBranchesEnum = z.enum(eventScoutBranches, 'Deve-se escolher um ramo para o evento');
export const PaymentStatusEnum = z.enum(paymentStatus);
export type ScoutBranches = z.infer<typeof ScoutBranchesEnum>;
export type EventScoutBranches = z.infer<typeof EventScoutBranchesEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const ScoutDataSchema = z.object({
  nome: z
    .string()
    .nonempty('Nome muito pequeno, requer ao menos 1 letra')
    .nonoptional('Deve incluir o nome do escoteiro'),
  responsavel: z.string().optional(),
  ramo: ScoutBranchesEnum,
  telefone: z.e164('Deve ser um telefone válido').nonempty().nonoptional('Preencha as informações de contato'),
  endereco: z.string().nonempty('Preencha as informações de contato').nonoptional('Preencha as informações de contato'),
});
export type ScoutData = z.infer<typeof ScoutDataSchema>;
export type ScoutDataInput = z.input<typeof ScoutDataSchema>;
export type ScoutDataOutput = z.output<typeof ScoutDataSchema>;

export const EventFormDataSchema = z.object({
  nome: z.string().nonempty('Nome muito pequeno, requer ao menos 1 letra').nonoptional(),
  local: z.string().min(4, 'Endereço válido é requerido').nonoptional(),
  dataInicio: z.iso.datetime({ local: true }).nonoptional(),
  dataFim: z.iso.datetime({ local: true }).nonoptional(),
  limiteVagas: z.number().optional().default(0),
  valor: z.number().optional().default(0),
  responsavel: z
    .string()
    .nonempty('Nome muito pequeno, requer ao menos 1 letra')
    .nonoptional('Deve incluir o nome do responsavel'),
  tipo: EventScoutBranchesEnum.nonoptional('Deve selecionar o ramo do Evento'),
  participants: z.record(
    z.string(),
    z.object({
      attended: z.boolean(),
      payment: PaymentStatusEnum,
    }),
  ),
});

export type EventFormData = z.infer<typeof EventFormDataSchema>;
export type EventFormDataInput = z.input<typeof EventFormDataSchema>;
export type EventFormDataOutput = z.output<typeof EventFormDataSchema>;
