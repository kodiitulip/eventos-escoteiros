import { Event } from '@/types/event.type';

export function mapEventListItem(event: Event) {
  return {
    id: event.id,
    nome: event.nome,
    dataInicio: event.dataInicio,
    dataFim: event.dataFim,
    local: event.local,
    valor: event.valor,
    limiteVagas: event.limiteVagas,
    inscritosCount: event.inscritosCount,
    ativo: event.ativo
  };
}
