import { apiRequest } from "./api";

type RelacaoNome = {
  id?: number;
  nome?: string;
  sigla?: string;
  numero?: string | number;
};

type UfResumo = {
  id?: number;
  sigla?: string;
  nome?: string;
};

export type ResultadoCandidato = {
  id?: number;
  nome?: string;
  numero?: number;
  partido?: RelacaoNome;
  cargo?: RelacaoNome;
  uf?: UfResumo;
};

export type ResultadoEleicao = {
  id?: number;
  nome?: string;
  status?: string;
};

export interface ResultadoVoto {
  id?: number;
  candidato?: ResultadoCandidato;
  eleicao?: ResultadoEleicao;
  totalVotos: number;
}

export function listarResultados() {
  return apiRequest<ResultadoVoto[]>("/api/apuracao");
}

export function listarResultadosPorEleicao(eleicaoId: number) {
  return apiRequest<ResultadoVoto[]>(`/api/apuracao/resultado/${eleicaoId}`);
}

export function obterNomeCandidato(candidato?: ResultadoCandidato) {
  if (!candidato) {
    return "Candidato não informado";
  }

  return candidato.nome ?? (candidato.id ? `Candidato #${candidato.id}` : "Candidato");
}

export function obterNomeEleicaoResultado(eleicao?: ResultadoEleicao) {
  if (!eleicao) {
    return "";
  }

  return eleicao.nome ?? (eleicao.id ? `Eleição #${eleicao.id}` : "");
}

export function obterNomeRelacaoResultado(valor?: RelacaoNome) {
  if (!valor) {
    return "";
  }

  if (valor.sigla && valor.nome) {
    return `${valor.sigla} - ${valor.nome}`;
  }

  return valor.nome ?? valor.sigla ?? "";
}

export function obterNomeUfResultado(uf?: UfResumo) {
  if (!uf) {
    return "";
  }

  if (uf.sigla && uf.nome) {
    return `${uf.sigla} - ${uf.nome}`;
  }

  return uf.sigla ?? uf.nome ?? "";
}
