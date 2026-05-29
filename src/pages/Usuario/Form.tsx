import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Mail, Save, User, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Usuario, UsuarioPayload } from "../../services/usuarioService";

interface UsuarioFormProps {
  usuario?: Usuario | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (usuario: UsuarioPayload) => Promise<void>;
}

interface UsuarioFormData {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: string;
}

export function UsuarioForm({
  usuario,
  isSubmitting,
  onCancel,
  onSubmit,
}: UsuarioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    defaultValues: {
      nome: "",
      email: "",
      senhaHash: "",
      perfil: "ADMIN",
    },
  });

  useEffect(() => {
    reset({
      nome: usuario?.nome ?? "",
      email: usuario?.email ?? "",
      senhaHash: "",
      perfil: usuario?.perfil ?? "ADMIN",
    });
  }, [reset, usuario]);

  const submitForm = async (data: UsuarioFormData) => {
    await onSubmit({
      nome: data.nome.trim(),
      email: data.email.trim(),
      senhaHash: data.senhaHash,
      perfil: data.perfil.trim().toUpperCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <User className="w-4 h-4" />
            Nome
          </Label>
          <Input
            id="nome"
            placeholder="Nome do usuário"
            className="h-11"
            {...register("nome", {
              required: "Nome é obrigatório",
              minLength: { value: 3, message: "Informe pelo menos 3 caracteres" },
            })}
          />
          {errors.nome && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.nome.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Mail className="w-4 h-4" />
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@email.com"
            className="h-11"
            {...register("email", {
              required: "E-mail é obrigatório",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Informe um e-mail válido",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="senhaHash" style={{ color: "#66BB6A" }}>
            Senha
          </Label>
          <Input
            id="senhaHash"
            type="password"
            placeholder="Senha de acesso"
            className="h-11"
            {...register("senhaHash", {
              required: "Senha é obrigatória",
              minLength: { value: 4, message: "Informe pelo menos 4 caracteres" },
            })}
          />
          {errors.senhaHash && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.senhaHash.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="perfil" style={{ color: "#66BB6A" }}>
            Perfil
          </Label>
          <select
            id="perfil"
            className="border-input bg-input-background flex h-11 w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
            {...register("perfil", {
              required: "Perfil é obrigatório",
            })}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="OPERADOR">OPERADOR</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="w-4 h-4" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
          style={{ backgroundColor: "#66BB6A", color: "white" }}
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
