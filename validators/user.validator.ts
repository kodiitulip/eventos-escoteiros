export function validateUserCreate(data: { nome: string; email: string; senha: string; cargo: string }) {
  if (!data.nome) throw new Error('Nome é obrigatório.');
  if (!data.email) throw new Error('Email é obrigatório.');
  if (!data.senha || data.senha.length < 6) {
    throw new Error('Senha deve ter no mínimo 6 caracteres.');
  }
  if (!data.cargo) throw new Error('Cargo é obrigatório.');
}
