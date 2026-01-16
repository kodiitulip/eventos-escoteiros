import { Event } from '@/types/event.type';

interface EventFilters {
  nome?: string;
  local?: string;
  ativo?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
  ordenarPor: keyof Event;
  ordem: 'asc' | 'desc';
}

export function applyEventFilters(events: (Event & { id: string })[], filters: EventFilters) {
  let result = [...events];

  if (filters.nome) {
    result = result.filter((e) => e.nome.toLowerCase().includes(filters.nome!.toLowerCase()));
  }

  if (filters.local) {
    result = result.filter((e) => e.local?.toLowerCase().includes(filters.local!.toLowerCase()));
  }

  if (filters.ativo !== undefined) {
    result = result.filter((e) => e.ativo === filters.ativo);
  }

  if (filters.dataInicio) {
    result = result.filter((e) => new Date(e.dataInicio) >= filters.dataInicio!);
  }

  if (filters.dataFim) {
    result = result.filter((e) => new Date(e.dataFim) <= filters.dataFim!);
  }

  if (filters.valorMin !== undefined) {
    result = result.filter((e) => e.valor >= filters.valorMin!);
  }

  if (filters.valorMax !== undefined) {
    result = result.filter((e) => e.valor <= filters.valorMax!);
  }

  result.sort((a, b) => {
    const field = filters.ordenarPor;
    return (
      filters.ordem === 'desc' ?
        a[field] < b[field] ?
          1
        : -1
      : a[field] > b[field] ? 1
      : -1
    );
  });

  return result;
}
