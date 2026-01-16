import { EventData, EventType } from '@/types/event.type';

interface EventFilters {
  nome?: string;
  local?: string;
  ativo?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
  tipo?: EventType;
  ordenarPor: keyof EventData;
  ordem: 'asc' | 'desc';
}

export function applyEventFilters(events: EventData[], filters: EventFilters) {
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

  if (filters.tipo !== undefined) {
    result = result.filter(({ tipo }) => tipo === filters.tipo!);
  }

  result.sort((a, b) => {
    const field = filters.ordenarPor;
    if (!a[field] || !b[field]) return 1;
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
