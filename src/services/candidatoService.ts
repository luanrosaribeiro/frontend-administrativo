import { apiRequest } from "./api";

type RelacaoNome = {
  id?: number;
  nome?: string;
  sigla?: string;
};

type ZonaEleitoralResumo = {
  id?: number;
  numero?: string | number;
  nome?: string;
  cidade?: string;
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
  zona?: ZonaEleitoralResumo;
}

export interface CandidatoFormPayload {
  nome: string;
  numero: number;
  partidoId: number;
  cargoId: number;
  eleicaoId: number;
  zonaId: number;
}

interface CandidatoApiPayload {
  nome: string;
  numero: number;
  partido: RelacaoId;
  cargo: RelacaoId;
  eleicao: RelacaoId;
  zona: RelacaoId;
}

function montarPayload(candidato: CandidatoFormPayload): CandidatoApiPayload {
  return {
    nome: candidato.nome,
    numero: candidato.numero,
    partido: { id: candidato.partidoId },
    cargo: { id: candidato.cargoId },
    eleicao: { id: candidato.eleicaoId },
    zona: { id: candidato.zonaId },
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

export function obterNomeZona(valor: ZonaEleitoralResumo | undefined) {
  if (!valor) {
    return "";
  }

  if (valor.cidade && valor.numero !== undefined) {
    return `Zona ${valor.numero} - ${valor.cidade}`;
  }

  return valor.nome ?? (valor.numero !== undefined ? `Zona ${valor.numero}` : "");
}
