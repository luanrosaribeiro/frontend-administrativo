import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, MapPin, MapPinned, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type {
  SecaoEleitoral,
  SecaoEleitoralFormPayload,
} from "../../services/secaoEleitoralService";

interface SecaoEleitoralFormProps {
  secao?: SecaoEleitoral | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (secao: SecaoEleitoralFormPayload) => Promise<void>;
}

interface SecaoEleitoralFormData {
  local: string;
  zonaId: number;
}

export function SecaoEleitoralForm({
  secao,
  isSubmitting,
  onCancel,
  onSubmit,
}: SecaoEleitoralFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecaoEleitoralFormData>({
    defaultValues: {
      local: "",
      zonaId: 0,
    },
  });

  useEffect(() => {
    reset({
      local: secao?.local ?? "",
      zonaId: secao?.zona?.id ?? 0,
    });
  }, [reset, secao]);

  const submitForm = async (data: SecaoEleitoralFormData) => {
    await onSubmit({
      local: data.local.trim(),
      zonaId: Number(data.zonaId),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <Label htmlFor="local" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <MapPinned className="w-4 h-4" />
            Local
          </Label>
          <Input
            id="local"
            placeholder="Local da seção eleitoral"
            className="h-11"
            maxLength={150}
            {...register("local", {
              required: "Local é obrigatório",
              minLength: { value: 3, message: "Informe pelo menos 3 caracteres" },
            })}
          />
          {errors.local && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.local.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zonaId" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <MapPin className="w-4 h-4" />
            Zona
          </Label>
          <Input
            id="zonaId"
            type="number"
            min={1}
            placeholder="ID da zona"
            className="h-11"
            {...register("zonaId", {
              required: "Zona é obrigatória",
              valueAsNumber: true,
              min: { value: 1, message: "Informe o ID da zona" },
            })}
          />
          {errors.zonaId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.zonaId.message}
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
