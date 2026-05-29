import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Building2, Edit, Hash, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarPartido,
  criarPartido,
  deletarPartido,
  listarPartidos,
  type Partido,
  type PartidoPayload,
} from "../../services/partidoService";
import { PartidoForm } from "./Form";

export function ListPartido() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [partidoSelecionado, setPartidoSelecionado] = useState<Partido | null>(null);

  const carregarPartidos = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarPartidos();
      setPartidos(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar partidos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarPartidos();
  }, [carregarPartidos]);

  const partidosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return partidos;
    }

    return partidos.filter((partido) => {
      return (
        partido.nome.toLowerCase().includes(termo) ||
        partido.sigla.toLowerCase().includes(termo) ||
        String(partido.numero).includes(termo)
      );
    });
  }, [busca, partidos]);

  const abrirCriacao = () => {
    setPartidoSelecionado(null);
    setFormAberto(true);
  };

  const abrirEdicao = (partido: Partido) => {
    setPartidoSelecionado(partido);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setPartidoSelecionado(null);
  };

  const salvarPartido = async (payload: PartidoPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (partidoSelecionado?.id) {
        await atualizarPartido(partidoSelecionado.id, payload);
      } else {
        await criarPartido(payload);
      }

      fecharFormulario();
      await carregarPartidos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar partido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirPartido = async (partido: Partido) => {
    if (!partido.id || !confirm(`Deseja excluir ${partido.nome}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarPartido(partido.id);
      await carregarPartidos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir partido.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <Building2 className="w-8 h-8" />
            Partidos
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de partidos.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Novo Partido
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar partido por nome, sigla ou número..."
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
                {partidoSelecionado ? "Editar Partido" : "Novo Partido"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <PartidoForm
              partido={partidoSelecionado}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarPartido}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando partidos...
            </CardContent>
          </Card>
        ) : partidosFiltrados.length > 0 ? (
          partidosFiltrados.map((partido) => (
            <Card key={partido.id ?? partido.numero} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center text-xl bg-gray-200 shrink-0">
                      <span style={{ color: "#66BB6A" }}>{partido.sigla}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg truncate">{partido.nome}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          {partido.numero}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(partido)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirPartido(partido)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Nenhum partido encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
