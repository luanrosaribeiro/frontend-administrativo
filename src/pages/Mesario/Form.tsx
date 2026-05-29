import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, FileText, MapPinned, Save, User, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Mesario, MesarioFormPayload } from "../../services/mesarioService";

interface MesarioFormProps {
  mesario?: Mesario | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (mesario: MesarioFormPayload) => Promise<void>;
}

interface MesarioFormData {
  nome: string;
  cpf: string;
  secaoId: number;
}

export function MesarioForm({
  mesario,
  isSubmitting,
  onCancel,
  onSubmit,
}: MesarioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MesarioFormData>({
    defaultValues: {
      nome: "",
      cpf: "",
      secaoId: 0,
    },
  });

  useEffect(() => {
    reset({
      nome: mesario?.nome ?? "",
      cpf: mesario?.cpf ?? "",
      secaoId: mesario?.secao?.id ?? 0,
    });
  }, [mesario, reset]);

  const submitForm = async (data: MesarioFormData) => {
    await onSubmit({
      nome: data.nome.trim(),
      cpf: data.cpf.trim(),
      secaoId: Number(data.secaoId),
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
            placeholder="Nome do mesário"
            className="h-11"
            maxLength={100}
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
          <Label htmlFor="cpf" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <FileText className="w-4 h-4" />
            CPF
          </Label>
          <Input
            id="cpf"
            placeholder="Somente números"
            className="h-11"
            maxLength={11}
            {...register("cpf", {
              required: "CPF é obrigatório",
              pattern: {
                value: /^\d{11}$/,
                message: "Informe 11 números",
              },
            })}
          />
          {errors.cpf && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.cpf.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secaoId" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
          <MapPinned className="w-4 h-4" />
          Seção
        </Label>
        <Input
          id="secaoId"
          type="number"
          min={1}
          placeholder="ID da seção"
          className="h-11"
          {...register("secaoId", {
            required: "Seção é obrigatória",
            valueAsNumber: true,
            min: { value: 1, message: "Informe o ID da seção" },
          })}
        />
        {errors.secaoId && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.secaoId.message}
          </p>
        )}
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
