import { apiRequest } from "./api";

type RelacaoNome = {
  id?: number;
  nome?: string;
  sigla?: string;
};

type RelacaoId = {
  id: number;
};

export interface Candidato {
  id?: number;
  nome: string;
  numero: number;
  partido: RelacaoNome;
  cargo: RelacaoNome;
  eleicao: RelacaoNome;
}

export interface CandidatoFormPayload {
  nome: string;
  numero: number;
  partidoId: number;
  cargoId: number;
  eleicaoId: number;
}

interface CandidatoApiPayload {
  nome: string;
  numero: number;
  partido: RelacaoId;
  cargo: RelacaoId;
  eleicao: RelacaoId;
}

function montarPayload(candidato: CandidatoFormPayload): CandidatoApiPayload {
  return {
    nome: candidato.nome,
    numero: candidato.numero,
    partido: { id: candidato.partidoId },
    cargo: { id: candidato.cargoId },
    eleicao: { id: candidato.eleicaoId },
  };
}

export function listarCandidatos() {
  return apiRequest<Candidato[]>("/api/candidato");
}

export function criarCandidato(candidato: CandidatoFormPayload) {
  return apiRequest<Candidato>("/api/candidato", {
    method: "POST",
    body: montarPayload(candidato),
  });
}

export function atualizarCandidato(id: number, candidato: CandidatoFormPayload) {
  return apiRequest<Candidato>(`/api/candidato/${id}`, {
    method: "PUT",
    body: montarPayload(candidato),
  });
}

export function deletarCandidato(id: number) {
  return apiRequest<void>(`/api/candidato/${id}`, {
    method: "DELETE",
  });
}

export function obterNomeRelacao(valor: RelacaoNome | undefined) {
  if (!valor) {
    return "";
  }

  return valor.nome ?? valor.sigla ?? "";
}
