import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Plus, Search, Trash2, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarEleitor,
  criarEleitor,
  deletarEleitor,
  listarEleitores,
  obterNomeSecao,
  obterNomeZona,
  type Eleitor,
  type EleitorFormPayload,
} from "../../services/eleitorService";
import { EleitorForm } from "./Form";

export function ListEleitor() {
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [eleitorSelecionado, setEleitorSelecionado] = useState<Eleitor | null>(null);

  const carregarEleitores = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarEleitores();
      setEleitores(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar eleitores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarEleitores();
  }, [carregarEleitores]);

  const eleitoresFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return eleitores;
    }

    return eleitores.filter((eleitor) => {
      const secao = obterNomeSecao(eleitor.secao).toLowerCase();
      const zona = obterNomeZona(eleitor.zona ?? eleitor.secao?.zona).toLowerCase();

      return (
        eleitor.nome.toLowerCase().includes(termo) ||
        eleitor.cpf.includes(termo) ||
        eleitor.titulo.includes(termo) ||
        secao.includes(termo) ||
        zona.includes(termo)
      );
    });
  }, [busca, eleitores]);

  const abrirCriacao = () => {
    setEleitorSelecionado(null);
    setFormAberto(true);
  };

  const abrirEdicao = (eleitor: Eleitor) => {
    setEleitorSelecionado(eleitor);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setEleitorSelecionado(null);
  };

  const salvarEleitor = async (payload: EleitorFormPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (eleitorSelecionado?.id) {
        await atualizarEleitor(eleitorSelecionado.id, payload);
      } else {
        await criarEleitor(payload);
      }

      fecharFormulario();
      await carregarEleitores();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar eleitor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirEleitor = async (eleitor: Eleitor) => {
    if (!eleitor.id || !confirm(`Deseja excluir ${eleitor.nome}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarEleitor(eleitor.id);
      await carregarEleitores();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir eleitor.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <Users className="w-8 h-8" />
            Eleitores
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de eleitores.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Novo Eleitor
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar eleitor por nome, CPF, título, seção ou zona..."
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
                {eleitorSelecionado ? "Editar Eleitor" : "Novo Eleitor"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <EleitorForm
              eleitor={eleitorSelecionado}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarEleitor}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando eleitores...
            </CardContent>
          </Card>
        ) : eleitoresFiltrados.length > 0 ? (
          eleitoresFiltrados.map((eleitor) => {
            const zona = obterNomeZona(eleitor.zona ?? eleitor.secao?.zona);

            return (
              <Card key={eleitor.id ?? eleitor.cpf} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <Users className="w-8 h-8" style={{ color: "#66BB6A" }} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg truncate">{eleitor.nome}</h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                          <span>CPF: {eleitor.cpf}</span>
                          <span>Título: {eleitor.titulo}</span>
                          <span>{obterNomeSecao(eleitor.secao)}</span>
                          {zona && <span>{zona}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => abrirEdicao(eleitor)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => void excluirEleitor(eleitor)}
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
              Nenhum eleitor encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
