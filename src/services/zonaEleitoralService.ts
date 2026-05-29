import { apiRequest } from "./api";

export interface ZonaEleitoral {
  id?: number;
  numero: number;
  cidade: string;
}

export type ZonaEleitoralPayload = Omit<ZonaEleitoral, "id">;

export function listarZonasEleitorais() {
  return apiRequest<ZonaEleitoral[]>("/api/zonas");
}

export function buscarZonaEleitoral(id: number) {
  return apiRequest<ZonaEleitoral>(`/api/zonas/${id}`);
}

export function criarZonaEleitoral(zona: ZonaEleitoralPayload) {
  return apiRequest<ZonaEleitoral>("/api/zonas", {
    method: "POST",
    body: zona,
  });
}

export function atualizarZonaEleitoral(id: number, zona: ZonaEleitoralPayload) {
  return apiRequest<ZonaEleitoral>(`/api/zonas/${id}`, {
    method: "PUT",
    body: zona,
  });
}

export function deletarZonaEleitoral(id: number) {
  return apiRequest<void>(`/api/zonas/${id}`, {
    method: "DELETE",
  });
}
