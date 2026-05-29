import { apiRequest } from "./api";

export interface Partido {
  id?: number;
  nome: string;
  sigla: string;
  numero: number;
}

export type PartidoPayload = Omit<Partido, "id">;

export function listarPartidos() {
  return apiRequest<Partido[]>("/api/partidos");
}

export function criarPartido(partido: PartidoPayload) {
  return apiRequest<Partido>("/api/partidos", {
    method: "POST",
    body: partido,
  });
}

export function atualizarPartido(id: number, partido: PartidoPayload) {
  return apiRequest<Partido>(`/api/partidos/${id}`, {
    method: "PUT",
    body: partido,
  });
}

export function deletarPartido(id: number) {
  return apiRequest<string | null>(`/api/partidos/${id}`, {
    method: "DELETE",
  });
}
