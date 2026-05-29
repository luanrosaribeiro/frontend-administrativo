import { apiRequest } from "./api";

type SecaoEleitoralResumo = {
  id?: number;
  numero?: string | number;
  nome?: string;
  zona?: {
    id?: number;
    numero?: string | number;
    nome?: string;
  };
};

type RelacaoId = {
  id: number;
};

export interface Eleitor {
  id?: number;
  nome: string;
  cpf: string;
  titulo: string;
  secao: SecaoEleitoralResumo;
}

export interface EleitorFormPayload {
  nome: string;
  cpf: string;
  titulo: string;
  secaoId: number;
}

interface EleitorApiPayload {
  nome: string;
  cpf: string;
  titulo: string;
  secao: RelacaoId;
}

function montarPayload(eleitor: EleitorFormPayload): EleitorApiPayload {
  return {
    nome: eleitor.nome,
    cpf: eleitor.cpf,
    titulo: eleitor.titulo,
    secao: { id: eleitor.secaoId },
  };
}

export function listarEleitores() {
  return apiRequest<Eleitor[]>("/api/eleitores");
}

export function buscarEleitor(id: number) {
  return apiRequest<Eleitor>(`/api/eleitores/${id}`);
}

export function criarEleitor(eleitor: EleitorFormPayload) {
  return apiRequest<Eleitor>("/api/eleitores", {
    method: "POST",
    body: montarPayload(eleitor),
  });
}

export function atualizarEleitor(id: number, eleitor: EleitorFormPayload) {
  return apiRequest<Eleitor>(`/api/eleitores/${id}`, {
    method: "PUT",
    body: montarPayload(eleitor),
  });
}

export function deletarEleitor(id: number) {
  return apiRequest<void>(`/api/eleitores/${id}`, {
    method: "DELETE",
  });
}

export function obterNomeSecao(secao?: SecaoEleitoralResumo) {
  if (!secao) {
    return "";
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
