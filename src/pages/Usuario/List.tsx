import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Edit,
  Mail,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCog,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  atualizarUsuario,
  criarUsuario,
  deletarUsuario,
  listarUsuarios,
  type Usuario,
  type UsuarioPayload,
} from "../../services/usuarioService";
import { UsuarioForm } from "./Form";

function formatarData(data?: string) {
  if (!data) {
    return "";
  }

  return new Date(data).toLocaleDateString("pt-BR");
}

export function ListUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

  const carregarUsuarios = useCallback(async () => {
    setIsLoading(true);
    setErro("");

    try {
      const dados = await listarUsuarios();
      setUsuarios(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarUsuarios();
  }, [carregarUsuarios]);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return usuarios;
    }

    return usuarios.filter((usuario) => {
      return (
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.perfil.toLowerCase().includes(termo)
      );
    });
  }, [busca, usuarios]);

  const abrirCriacao = () => {
    setUsuarioSelecionado(null);
    setFormAberto(true);
  };

  const abrirEdicao = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setFormAberto(true);
  };

  const fecharFormulario = () => {
    setFormAberto(false);
    setUsuarioSelecionado(null);
  };

  const salvarUsuario = async (payload: UsuarioPayload) => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (usuarioSelecionado?.id) {
        await atualizarUsuario(usuarioSelecionado.id, payload);
      } else {
        await criarUsuario(payload);
      }

      fecharFormulario();
      await carregarUsuarios();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirUsuario = async (usuario: Usuario) => {
    if (!usuario.id || !confirm(`Deseja excluir ${usuario.nome}?`)) {
      return;
    }

    setErro("");

    try {
      await deletarUsuario(usuario.id);
      await carregarUsuarios();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir usuário.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <UserCog className="w-8 h-8" />
            Usuários
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de usuários administrativos.</p>
        </div>
        <Button
          onClick={abrirCriacao}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuário por nome, e-mail ou perfil..."
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
                {usuarioSelecionado ? "Editar Usuário" : "Novo Usuário"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preencha os dados de acesso do usuário administrativo.
              </p>
            </div>
            <UsuarioForm
              usuario={usuarioSelecionado}
              isSubmitting={isSubmitting}
              onCancel={fecharFormulario}
              onSubmit={salvarUsuario}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando usuários...
            </CardContent>
          </Card>
        ) : usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((usuario) => (
            <Card key={usuario.id ?? usuario.email} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <UserCog className="w-8 h-8" style={{ color: "#66BB6A" }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg truncate">{usuario.nome}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4 shrink-0" />
                          {usuario.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-4 h-4 shrink-0" />
                          {usuario.perfil}
                        </span>
                        {usuario.criadoEm && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 shrink-0" />
                            {formatarData(usuario.criadoEm)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => abrirEdicao(usuario)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => void excluirUsuario(usuario)}
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
              Nenhum usuário encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
