import { apiRequest } from "./api";

type ZonaEleitoralResumo = {
  id?: number;
  numero?: string | number;
  cidade?: string;
  nome?: string;
};

type RelacaoId = {
  id: number;
};

export interface SecaoEleitoral {
  id?: number;
  local: string;
  zona: ZonaEleitoralResumo;
}

export interface SecaoEleitoralFormPayload {
  local: string;
  zonaId: number;
}

interface SecaoEleitoralApiPayload {
  local: string;
  zona: RelacaoId;
}

function montarPayload(secao: SecaoEleitoralFormPayload): SecaoEleitoralApiPayload {
  return {
    local: secao.local,
    zona: { id: secao.zonaId },
  };
}

export function listarSecoesEleitorais() {
  return apiRequest<SecaoEleitoral[]>("/api/secoes");
}

export function buscarSecaoEleitoral(id: number) {
  return apiRequest<SecaoEleitoral>(`/api/secoes/${id}`);
}

export function listarSecoesPorZona(zonaId: number) {
  return apiRequest<SecaoEleitoral[]>(`/api/secoes/zona/${zonaId}`);
}

export function criarSecaoEleitoral(secao: SecaoEleitoralFormPayload) {
  return apiRequest<SecaoEleitoral>("/api/secoes", {
    method: "POST",
    body: montarPayload(secao),
  });
}

export function atualizarSecaoEleitoral(id: number, secao: SecaoEleitoralFormPayload) {
  return apiRequest<SecaoEleitoral>(`/api/secoes/${id}`, {
    method: "PUT",
    body: montarPayload(secao),
  });
}

export function deletarSecaoEleitoral(id: number) {
  return apiRequest<void>(`/api/secoes/${id}`, {
    method: "DELETE",
  });
}

export function obterNomeZonaSecao(zona?: ZonaEleitoralResumo) {
  if (!zona) {
    return "";
  }

  if (zona.cidade && zona.numero !== undefined) {
    return `Zona ${zona.numero} - ${zona.cidade}`;
  }

  if (zona.nome) {
    return zona.nome;
  }

  if (zona.cidade) {
    return zona.cidade;
  }

  if (zona.numero !== undefined) {
    return `Zona ${zona.numero}`;
  }

  if (zona.id !== undefined) {
    return `Zona #${zona.id}`;
  }

  return "";
}
