import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Building2, Hash, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Partido, PartidoPayload } from "../../services/partidoService";

interface PartidoFormProps {
  partido?: Partido | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (partido: PartidoPayload) => Promise<void>;
}

interface PartidoFormData {
  nome: string;
  sigla: string;
  numero: number;
}

export function PartidoForm({
  partido,
  isSubmitting,
  onCancel,
  onSubmit,
}: PartidoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartidoFormData>({
    defaultValues: {
      nome: "",
      sigla: "",
      numero: 0,
    },
  });

  useEffect(() => {
    reset({
      nome: partido?.nome ?? "",
      sigla: partido?.sigla ?? "",
      numero: partido?.numero ?? 0,
    });
  }, [partido, reset]);

  const submitForm = async (data: PartidoFormData) => {
    await onSubmit({
      nome: data.nome.trim(),
      sigla: data.sigla.trim().toUpperCase(),
      numero: Number(data.numero),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[1fr_140px_140px]">
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Building2 className="w-4 h-4" />
            Nome
          </Label>
          <Input
            id="nome"
            placeholder="Nome do partido"
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
          <Label htmlFor="sigla" style={{ color: "#66BB6A" }}>
            Sigla
          </Label>
          <Input
            id="sigla"
            placeholder="ABC"
            className="h-11 uppercase"
            maxLength={10}
            {...register("sigla", {
              required: "Sigla é obrigatória",
              minLength: { value: 2, message: "Informe pelo menos 2 caracteres" },
            })}
          />
          {errors.sigla && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.sigla.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Hash className="w-4 h-4" />
            Número
          </Label>
          <Input
            id="numero"
            type="number"
            min={1}
            placeholder="00"
            className="h-11"
            {...register("numero", {
              required: "Número é obrigatório",
              valueAsNumber: true,
              min: { value: 1, message: "Informe um número maior que zero" },
            })}
          />
          {errors.numero && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.numero.message}
            </p>
          )}
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
