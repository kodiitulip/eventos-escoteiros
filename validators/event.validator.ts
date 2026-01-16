import { Event } from '@/types/event.type';

export function validateEventData(event: Event) {
  const now = new Date();

  if (event.dataInicio < now) {
    throw new Error('A data de início não pode ser no passado.');
  }

  if (event.dataFim <= event.dataInicio) {
    throw new Error('A data de fim deve ser posterior à data de início.');
  }

  if (event.limiteVagas <= 0) {
    throw new Error('O limite de vagas deve ser um número positivo.');
  }
}
