import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, MapPinned, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarSecaoEleitoral,
  criarSecaoEleitoral,
  deletarSecaoEleitoral,
  listarSecoesEleitorais,
  obterNomeZonaSecao,
  type SecaoEleitoral,
  type SecaoEleitoralFormPayload,
} from "../../services/secaoEleitoralService";
import { SecaoEleitoralForm } from "./Form";

export function ListSecaoEleitoral() {
  const [secoes, setSecoes] = useState<SecaoEleitoral[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [secaoSelecionada, setSecaoSelecionada] = useState<SecaoEleitoral | null>(null);

  const carregarSecoes = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarSecoesEleitorais();
      setSecoes(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar seções eleitorais.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarSecoes();
  }, [carregarSecoes]);

  const secoesFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return secoes;
    }

    return secoes.filter((secao) => {
      const zona = obterNomeZonaSecao(secao.zona).toLowerCase();

      return secao.local.toLowerCase().includes(termo) || zona.includes(termo);
    });
  }, [busca, secoes]);

  const abrirCriacao = () => {
    setSecaoSelecionada(null);
    setFormAberto(true);
  };

  const abrirEdicao = (secao: SecaoEleitoral) => {
    setSecaoSelecionada(secao);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setSecaoSelecionada(null);
  };

  const salvarSecao = async (payload: SecaoEleitoralFormPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (secaoSelecionada?.id) {
        await atualizarSecaoEleitoral(secaoSelecionada.id, payload);
      } else {
        await criarSecaoEleitoral(payload);
      }

      fecharFormulario();
      await carregarSecoes();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar seção eleitoral.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirSecao = async (secao: SecaoEleitoral) => {
    if (!secao.id || !confirm(`Deseja excluir a seção em ${secao.local}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarSecaoEleitoral(secao.id);
      await carregarSecoes();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir seção eleitoral.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <MapPinned className="w-8 h-8" />
            Seções Eleitorais
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento das seções eleitorais.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Nova Seção
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar seção por local ou zona..."
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
                {secaoSelecionada ? "Editar Seção Eleitoral" : "Nova Seção Eleitoral"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <SecaoEleitoralForm
              secao={secaoSelecionada}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarSecao}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando seções eleitorais...
            </CardContent>
          </Card>
        ) : secoesFiltradas.length > 0 ? (
          secoesFiltradas.map((secao) => (
            <Card key={secao.id ?? secao.local} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <MapPinned className="w-8 h-8" style={{ color: "#66BB6A" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg truncate">{secao.local}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span>{obterNomeZonaSecao(secao.zona)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(secao)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirSecao(secao)}
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
              Nenhuma seção eleitoral encontrada para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
