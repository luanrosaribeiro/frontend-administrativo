import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Hash, Plus, Power, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarUrna,
  criarUrna,
  deletarUrna,
  listarUrnas,
  obterNomeEleicaoUrna,
  obterNomeSecaoUrna,
  type Urna,
  type UrnaFormPayload,
} from "../../services/urnaService";
import { UrnaForm } from "./Form";

export function ListUrna() {
  const [urnas, setUrnas] = useState<Urna[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [urnaSelecionada, setUrnaSelecionada] = useState<Urna | null>(null);

  const carregarUrnas = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarUrnas();
      setUrnas(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar urnas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarUrnas();
  }, [carregarUrnas]);

  const urnasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return urnas;
    }

    return urnas.filter((urna) => {
      const secao = obterNomeSecaoUrna(urna.secao).toLowerCase();
      const eleicao = obterNomeEleicaoUrna(urna.eleicao).toLowerCase();

      return (
        String(urna.numero).includes(termo) ||
        urna.status.toLowerCase().includes(termo) ||
        secao.includes(termo) ||
        eleicao.includes(termo)
      );
    });
  }, [busca, urnas]);

  const abrirCriacao = () => {
    setUrnaSelecionada(null);
    setFormAberto(true);
  };

  const abrirEdicao = (urna: Urna) => {
    setUrnaSelecionada(urna);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setUrnaSelecionada(null);
  };

  const salvarUrna = async (payload: UrnaFormPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (urnaSelecionada?.id) {
        await atualizarUrna(urnaSelecionada.id, payload);
      } else {
        await criarUrna(payload);
      }

      fecharFormulario();
      await carregarUrnas();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar urna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirUrna = async (urna: Urna) => {
    if (!urna.id || !confirm(`Deseja excluir a urna ${urna.numero}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarUrna(urna.id);
      await carregarUrnas();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir urna.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <Power className="w-8 h-8" />
            Urnas
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento das urnas eleitorais.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Nova Urna
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar urna por número, status, seção ou eleição..."
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
                {urnaSelecionada ? "Editar Urna" : "Nova Urna"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <UrnaForm
              urna={urnaSelecionada}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarUrna}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando urnas...
            </CardContent>
          </Card>
        ) : urnasFiltradas.length > 0 ? (
          urnasFiltradas.map((urna) => (
            <Card key={urna.id ?? urna.numero} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <Power className="w-8 h-8" style={{ color: "#66BB6A" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg flex items-center gap-2">
                        <Hash className="w-4 h-4 shrink-0" />
                        <span className="truncate">Urna {urna.numero}</span>
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span>Status: {urna.status}</span>
                        <span>{obterNomeSecaoUrna(urna.secao)}</span>
                        <span>{obterNomeEleicaoUrna(urna.eleicao)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(urna)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirUrna(urna)}
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
              Nenhuma urna encontrada para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
