import { apiRequest } from "./api";

export interface Cargo {
  id?: number;
  nome: string;
  quantidadeVagas: number;
}

export type CargoPayload = Omit<Cargo, "id">;

export function listarCargos() {
  return apiRequest<Cargo[]>("/api/cargos");
}

export function criarCargo(cargo: CargoPayload) {
  return apiRequest<Cargo>("/api/cargos", {
    method: "POST",
    body: cargo,
  });
}

export function atualizarCargo(id: number, cargo: CargoPayload) {
  return apiRequest<Cargo>(`/api/cargos/${id}`, {
    method: "PUT",
    body: cargo,
  });
}

export function deletarCargo(id: number) {
  return apiRequest<void>(`/api/cargos/${id}`, {
    method: "DELETE",
  });
}
