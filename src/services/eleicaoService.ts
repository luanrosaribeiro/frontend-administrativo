import { apiRequest } from "./api";

export interface Eleicao {
  id?: number;
  nome: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
}

export function listarEleicoes() {
  return apiRequest<Eleicao[]>("/api/eleicoes");
}

export function obterNomeEleicao(eleicao: Eleicao) {
  return eleicao.nome || (eleicao.id ? `Eleição #${eleicao.id}` : "Eleição");
}
