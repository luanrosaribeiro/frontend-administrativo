import { apiRequest } from "./api";

type SecaoEleitoralResumo = {
  id?: number;
  local?: string;
  numero?: string | number;
  nome?: string;
};

type EleicaoResumo = {
  id?: number;
  nome?: string;
  titulo?: string;
  descricao?: string;
  ano?: string | number;
};

type RelacaoId = {
  id: number;
};

export interface Urna {
  id?: number;
  numero: number;
  status: string;
  secao: SecaoEleitoralResumo;
  eleicao: EleicaoResumo;
}

export interface UrnaFormPayload {
  numero: number;
  status: string;
  secaoId: number;
  eleicaoId: number;
}

interface UrnaApiPayload {
  numero: number;
  status: string;
  secao: RelacaoId;
  eleicao: RelacaoId;
}

function montarPayload(urna: UrnaFormPayload): UrnaApiPayload {
  return {
    numero: urna.numero,
    status: urna.status,
    secao: { id: urna.secaoId },
    eleicao: { id: urna.eleicaoId },
  };
}

export function listarUrnas() {
  return apiRequest<Urna[]>("/api/urnas");
}

export function buscarUrna(id: number) {
  return apiRequest<Urna>(`/api/urnas/${id}`);
}

export function listarUrnasPorEleicao(eleicaoId: number) {
  return apiRequest<Urna[]>(`/api/urnas/eleicao/${eleicaoId}`);
}

export function listarUrnasPorSecao(secaoId: number) {
  return apiRequest<Urna[]>(`/api/urnas/secao/${secaoId}`);
}

export function criarUrna(urna: UrnaFormPayload) {
  return apiRequest<Urna>("/api/urnas", {
    method: "POST",
    body: montarPayload(urna),
  });
}

export function atualizarUrna(id: number, urna: UrnaFormPayload) {
  return apiRequest<Urna>(`/api/urnas/${id}`, {
    method: "PUT",
    body: montarPayload(urna),
  });
}

export function deletarUrna(id: number) {
  return apiRequest<void>(`/api/urnas/${id}`, {
    method: "DELETE",
  });
}

export function obterNomeSecaoUrna(secao?: SecaoEleitoralResumo) {
  if (!secao) {
    return "";
  }

  if (secao.local) {
    return secao.local;
  }

  if (secao.nome) {
    return secao.nome;
  }

  if (secao.numero !== undefined) {
    return `Seção ${secao.numero}`;
  }

  if (secao.id !== undefined) {
    return `Seção #${secao.id}`;
  }

  return "";
}

export function obterNomeEleicaoUrna(eleicao?: EleicaoResumo) {
  if (!eleicao) {
    return "";
  }

  if (eleicao.nome) {
    return eleicao.nome;
  }

  if (eleicao.titulo) {
    return eleicao.titulo;
  }

  if (eleicao.descricao) {
    return eleicao.descricao;
  }

  if (eleicao.ano !== undefined) {
    return `Eleição ${eleicao.ano}`;
  }

  if (eleicao.id !== undefined) {
    return `Eleição #${eleicao.id}`;
  }

  return "";
}
