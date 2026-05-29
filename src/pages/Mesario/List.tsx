import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ClipboardCheck, Edit, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarMesario,
  criarMesario,
  deletarMesario,
  listarMesarios,
  obterNomeSecaoMesario,
  type Mesario,
  type MesarioFormPayload,
} from "../../services/mesarioService";
import { MesarioForm } from "./Form";

export function ListMesario() {
  const [mesarios, setMesarios] = useState<Mesario[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [mesarioSelecionado, setMesarioSelecionado] = useState<Mesario | null>(null);

  const carregarMesarios = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarMesarios();
      setMesarios(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar mesários.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarMesarios();
  }, [carregarMesarios]);

  const mesariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return mesarios;
    }

    return mesarios.filter((mesario) => {
      const secao = obterNomeSecaoMesario(mesario.secao).toLowerCase();

      return (
        mesario.nome.toLowerCase().includes(termo) ||
        mesario.cpf.includes(termo) ||
        secao.includes(termo)
      );
    });
  }, [busca, mesarios]);

  const abrirCriacao = () => {
    setMesarioSelecionado(null);
    setFormAberto(true);
  };

  const abrirEdicao = (mesario: Mesario) => {
    setMesarioSelecionado(mesario);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setMesarioSelecionado(null);
  };

  const salvarMesario = async (payload: MesarioFormPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (mesarioSelecionado?.id) {
        await atualizarMesario(mesarioSelecionado.id, payload);
      } else {
        await criarMesario(payload);
      }

      fecharFormulario();
      await carregarMesarios();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar mesário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirMesario = async (mesario: Mesario) => {
    if (!mesario.id || !confirm(`Deseja excluir ${mesario.nome}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarMesario(mesario.id);
      await carregarMesarios();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir mesário.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <ClipboardCheck className="w-8 h-8" />
            Mesários
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de mesários.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Novo Mesário
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar mesário por nome, CPF ou seção..."
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
                {mesarioSelecionado ? "Editar Mesário" : "Novo Mesário"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <MesarioForm
              mesario={mesarioSelecionado}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarMesario}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando mesários...
            </CardContent>
          </Card>
        ) : mesariosFiltrados.length > 0 ? (
          mesariosFiltrados.map((mesario) => (
            <Card key={mesario.id ?? mesario.cpf} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-8 h-8" style={{ color: "#66BB6A" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg truncate">{mesario.nome}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span>CPF: {mesario.cpf}</span>
                        <span>{obterNomeSecaoMesario(mesario.secao)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(mesario)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirMesario(mesario)}
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
              Nenhum mesário encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
