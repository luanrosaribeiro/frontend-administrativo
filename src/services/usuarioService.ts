import { apiRequest } from "./api";

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senhaHash?: string;
  perfil: string;
  criadoEm?: string;
}

export interface UsuarioPayload {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: string;
}

export function listarUsuarios() {
  return apiRequest<Usuario[]>("/api/usuarios");
}

export function buscarUsuario(id: number) {
  return apiRequest<Usuario>(`/api/usuarios/${id}`);
}

export function criarUsuario(usuario: UsuarioPayload) {
  return apiRequest<Usuario>("/api/usuarios", {
    method: "POST",
    body: usuario,
  });
}

export function atualizarUsuario(id: number, usuario: UsuarioPayload) {
  return apiRequest<Usuario>(`/api/usuarios/${id}`, {
    method: "PUT",
    body: usuario,
  });
}

export function deletarUsuario(id: number) {
  return apiRequest<void>(`/api/usuarios/${id}`, {
    method: "DELETE",
  });
}

export function loginUsuario(email: string, senha: string) {
  const params = new URLSearchParams({ email, senha });

  return apiRequest<Usuario | string>(`/api/usuarios/login?${params.toString()}`, {
    method: "POST",
  });
}
