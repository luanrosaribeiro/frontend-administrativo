import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Hash, Plus, Search, Trash2, UserCheck } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarCandidato,
  criarCandidato,
  deletarCandidato,
  listarCandidatos,
  obterNomeRelacao,
  type Candidato,
  type CandidatoPayload,
} from "../../services/candidatoService";
import { CandidatoForm } from "./Form";

export function ListCandidato() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);

  const carregarCandidatos = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarCandidatos();
      setCandidatos(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar candidatos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarCandidatos();
  }, [carregarCandidatos]);

  const candidatosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return candidatos;
    }

    return candidatos.filter((candidato) => {
      const partido = obterNomeRelacao(candidato.partido).toLowerCase();
      const cargo = obterNomeRelacao(candidato.cargo).toLowerCase();

      return (
        candidato.nome.toLowerCase().includes(termo) ||
        candidato.numero.includes(termo) ||
        partido.includes(termo) ||
        cargo.includes(termo) ||
        String(candidato.numero).includes(termo)
      );
    });
  }, [busca, candidatos]);

  const abrirCriacao = () => {
    setCandidatoSelecionado(null);
    setFormAberto(true);
  };

  const abrirEdicao = (candidato: Candidato) => {
    setCandidatoSelecionado(candidato);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setCandidatoSelecionado(null);
  };

  const salvarCandidato = async (payload: CandidatoPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (candidatoSelecionado?.id) {
        await atualizarCandidato(candidatoSelecionado.id, payload);
      } else {
        await criarCandidato(payload);
      }

      fecharFormulario();
      await carregarCandidatos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar candidato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirCandidato = async (candidato: Candidato) => {
    if (!candidato.id || !confirm(`Deseja excluir ${candidato.nome}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarCandidato(candidato.id);
      await carregarCandidatos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir candidato.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <UserCheck className="w-8 h-8" />
            Candidatos
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de candidatos.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Novo Candidato
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar candidato por nome, número, partido ou cargo..."
              className="pl-10"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {erro && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {erro}
          </p>
        </div>
      )}

      {formAberto && (
        <Card className="border-2" style={{ borderColor: "#66BB6A" }}>
          <CardContent className="p-6">
            <div className="mb-5">
              <h2 className="text-xl" style={{ color: "#66BB6A" }}>
                {candidatoSelecionado ? "Editar Candidato" : "Novo Candidato"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <CandidatoForm
              candidato={candidatoSelecionado}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarCandidato}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando candidatos...
            </CardContent>
          </Card>
        ) : candidatosFiltrados.length > 0 ? (
          candidatosFiltrados.map((candidato) => {
            const partido = obterNomeRelacao(candidato.partido);
            const cargo = obterNomeRelacao(candidato.cargo);
            const eleicao = obterNomeRelacao(candidato.eleicao);

            return (
              <Card key={candidato.id ?? candidato.numero} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        <UserCheck className="w-8 h-8" style={{ color: "#66BB6A" }} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg truncate">{candidato.nome}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            {candidato.numero}
                          </span>
                          {partido && <span>{partido}</span>}
                          {cargo && <span>{cargo}</span>}
                          {eleicao && <span>{eleicao}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => abrirEdicao(candidato)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => void excluirCandidato(candidato)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Nenhum candidato encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
