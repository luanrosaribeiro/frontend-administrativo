import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Briefcase, Edit, ListChecks, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarCargo,
  criarCargo,
  deletarCargo,
  listarCargos,
  type Cargo,
  type CargoPayload,
} from "../../services/cargoService";
import { CargoForm } from "./Form";

export function ListCargo() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [cargoSelecionado, setCargoSelecionado] = useState<Cargo | null>(null);

  const carregarCargos = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarCargos();
      setCargos(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar cargos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarCargos();
  }, [carregarCargos]);

  const cargosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return cargos;
    }

    return cargos.filter((cargo) => {
      return (
        cargo.nome.toLowerCase().includes(termo) ||
        String(cargo.quantidadeVagas).includes(termo)
      );
    });
  }, [busca, cargos]);

  const abrirCriacao = () => {
    setCargoSelecionado(null);
    setFormAberto(true);
  };

  const abrirEdicao = (cargo: Cargo) => {
    setCargoSelecionado(cargo);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setCargoSelecionado(null);
  };

  const salvarCargo = async (payload: CargoPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (cargoSelecionado?.id) {
        await atualizarCargo(cargoSelecionado.id, payload);
      } else {
        await criarCargo(payload);
      }

      fecharFormulario();
      await carregarCargos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar cargo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirCargo = async (cargo: Cargo) => {
    if (!cargo.id || !confirm(`Deseja excluir ${cargo.nome}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarCargo(cargo.id);
      await carregarCargos();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir cargo.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <Briefcase className="w-8 h-8" />
            Cargos
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento dos cargos disponíveis para votação.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Novo Cargo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar cargo por nome ou vagas..."
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
                {cargoSelecionado ? "Editar Cargo" : "Novo Cargo"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados que serão enviados para a API.
              </p>
            </div>
            <CargoForm
              cargo={cargoSelecionado}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarCargo}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando cargos...
            </CardContent>
          </Card>
        ) : cargosFiltrados.length > 0 ? (
          cargosFiltrados.map((cargo) => (
            <Card key={cargo.id ?? cargo.nome} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-200 shrink-0">
                      <Briefcase className="w-8 h-8" style={{ color: "#66BB6A" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg truncate">{cargo.nome}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1 shrink-0">
                          <ListChecks className="w-4 h-4" />
                          Vagas: {cargo.quantidadeVagas}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(cargo)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirCargo(cargo)}
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
              Nenhum cargo encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
