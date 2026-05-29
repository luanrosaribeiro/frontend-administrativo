import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Hash, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarZonaEleitoral,
  criarZonaEleitoral,
  deletarZonaEleitoral,
  listarZonasEleitorais,
  type ZonaEleitoral,
  type ZonaEleitoralPayload,
} from "../../services/zonaEleitoralService";
import { ZonaEleitoralForm } from "./Form";

export function ListZonaEleitoral() {
  const [zonas, setZonas] = useState<ZonaEleitoral[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [zonaSelecionada, setZonaSelecionada] = useState<ZonaEleitoral | null>(null);

  const carregarZonas = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarZonasEleitorais();
      setZonas(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar zonas eleitorais.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarZonas();
  }, [carregarZonas]);

  const zonasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return zonas;
    }

    return zonas.filter((zona) => {
      return (
        String(zona.numero).includes(termo) ||
        zona.cidade.toLowerCase().includes(termo)
      );
    });
  }, [busca, zonas]);

  const abrirCriacao = () => {
    setZonaSelecionada(null);
    setFormAberto(true);
  };

  const abrirEdicao = (zona: ZonaEleitoral) => {
    setZonaSelecionada(zona);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setZonaSelecionada(null);
  };

  const salvarZona = async (payload: ZonaEleitoralPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (zonaSelecionada?.id) {
        await atualizarZonaEleitoral(zonaSelecionada.id, payload);
      } else {
        await criarZonaEleitoral(payload);
      }

      fecharFormulario();
      await carregarZonas();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar zona eleitoral.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirZona = async (zona: ZonaEleitoral) => {
    if (!zona.id || !confirm(`Deseja excluir a zona ${zona.numero}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarZonaEleitoral(zona.id);
      await carregarZonas();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir zona eleitoral.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <MapPin className="w-8 h-8" />
            Zonas Eleitorais
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento das zonas eleitorais.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Nova Zona
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar zona por número ou cidade..."
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
                {zonaSelecionada ? "Editar Zona Eleitoral" : "Nova Zona Eleitoral"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <ZonaEleitoralForm
              zona={zonaSelecionada}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarZona}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando zonas eleitorais...
            </CardContent>
          </Card>
        ) : zonasFiltradas.length > 0 ? (
          zonasFiltradas.map((zona) => (
            <Card key={zona.id ?? zona.numero} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <MapPin className="w-8 h-8" style={{ color: "#66BB6A" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg truncate">{zona.cidade}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          Zona {zona.numero}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(zona)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirZona(zona)}
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
              Nenhuma zona eleitoral encontrada para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
