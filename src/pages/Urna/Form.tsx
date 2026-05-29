import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CalendarDays, Hash, MapPinned, Power, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Urna, UrnaFormPayload } from "../../services/urnaService";

interface UrnaFormProps {
  urna?: Urna | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (urna: UrnaFormPayload) => Promise<void>;
}

interface UrnaFormData {
  numero: number;
  status: string;
  secaoId: number;
  eleicaoId: number;
}

export function UrnaForm({
  urna,
  isSubmitting,
  onCancel,
  onSubmit,
}: UrnaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrnaFormData>({
    defaultValues: {
      numero: 0,
      status: "",
      secaoId: 0,
      eleicaoId: 0,
    },
  });

  useEffect(() => {
    reset({
      numero: urna?.numero ?? 0,
      status: urna?.status ?? "",
      secaoId: urna?.secao?.id ?? 0,
      eleicaoId: urna?.eleicao?.id ?? 0,
    });
  }, [reset, urna]);

  const submitForm = async (data: UrnaFormData) => {
    await onSubmit({
      numero: Number(data.numero),
      status: data.status.trim(),
      secaoId: Number(data.secaoId),
      eleicaoId: Number(data.eleicaoId),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numero" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Hash className="w-4 h-4" />
            Número
          </Label>
          <Input
            id="numero"
            type="number"
            min={1}
            placeholder="Número da urna"
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

        <div className="space-y-2">
          <Label htmlFor="status" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Power className="w-4 h-4" />
            Status
          </Label>
          <Input
            id="status"
            placeholder="Ex.: ATIVA"
            className="h-11"
            maxLength={20}
            {...register("status", {
              required: "Status é obrigatório",
              minLength: { value: 2, message: "Informe pelo menos 2 caracteres" },
            })}
          />
          {errors.status && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
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

        <div className="space-y-2">
          <Label htmlFor="eleicaoId" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <CalendarDays className="w-4 h-4" />
            Eleição
          </Label>
          <Input
            id="eleicaoId"
            type="number"
            min={1}
            placeholder="ID da eleição"
            className="h-11"
            {...register("eleicaoId", {
              required: "Eleição é obrigatória",
              valueAsNumber: true,
              min: { value: 1, message: "Informe o ID da eleição" },
            })}
          />
          {errors.eleicaoId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.eleicaoId.message}
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
