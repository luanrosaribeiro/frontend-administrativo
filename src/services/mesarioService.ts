import { apiRequest } from "./api";

type SecaoEleitoralResumo = {
  id?: number;
  local?: string;
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

export interface Mesario {
  id?: number;
  nome: string;
  cpf: string;
  secao: SecaoEleitoralResumo;
}

export interface MesarioFormPayload {
  nome: string;
  cpf: string;
  secaoId: number;
}

interface MesarioApiPayload {
  nome: string;
  cpf: string;
  secao: RelacaoId;
}

function montarPayload(mesario: MesarioFormPayload): MesarioApiPayload {
  return {
    nome: mesario.nome,
    cpf: mesario.cpf,
    secao: { id: mesario.secaoId },
  };
}

export function listarMesarios() {
  return apiRequest<Mesario[]>("/api/mesarios");
}

export function buscarMesario(id: number) {
  return apiRequest<Mesario>(`/api/mesarios/${id}`);
}

export function criarMesario(mesario: MesarioFormPayload) {
  return apiRequest<Mesario>("/api/mesarios", {
    method: "POST",
    body: montarPayload(mesario),
  });
}

export function atualizarMesario(id: number, mesario: MesarioFormPayload) {
  return apiRequest<Mesario>(`/api/mesarios/${id}`, {
    method: "PUT",
    body: montarPayload(mesario),
  });
}

export function deletarMesario(id: number) {
  return apiRequest<void>(`/api/mesarios/${id}`, {
    method: "DELETE",
  });
}

export function obterNomeSecaoMesario(secao?: SecaoEleitoralResumo) {
  if (!secao) {
    return "";
  }

  if (secao.nome) {
    return secao.nome;
  }

  if (secao.local) {
    return secao.local;
  }

  if (secao.numero !== undefined) {
    return `Seção ${secao.numero}`;
  }

  if (secao.id !== undefined) {
    return `Seção #${secao.id}`;
  }

  return "";
}
