export interface Event {
  id?: string;

  nome: string;
  descricao: string;
  local: string;

  dataInicio: string;
  dataFim: string;

  limiteVagas: number;
  valor: number;
  responsavel: string;

  inscritosCount: number;
  ativo: boolean;

  createdAt: string;
  updatedAt: string;
}
