export interface User {
  uid: string;

  nome: string;
  email: string;
  cargo: 'ADMIN' | 'ASSISTENTE';

  ativo: boolean;

  createdAt: string;
  updatedAt: string;
}
