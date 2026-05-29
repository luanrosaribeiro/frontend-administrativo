import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Hash, MapPin, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type {
  ZonaEleitoral,
  ZonaEleitoralPayload,
} from "../../services/zonaEleitoralService";

interface ZonaEleitoralFormProps {
  zona?: ZonaEleitoral | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (zona: ZonaEleitoralPayload) => Promise<void>;
}

interface ZonaEleitoralFormData {
  numero: number;
  cidade: string;
}

export function ZonaEleitoralForm({
  zona,
  isSubmitting,
  onCancel,
  onSubmit,
}: ZonaEleitoralFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZonaEleitoralFormData>({
    defaultValues: {
      numero: 0,
      cidade: "",
    },
  });

  useEffect(() => {
    reset({
      numero: zona?.numero ?? 0,
      cidade: zona?.cidade ?? "",
    });
  }, [reset, zona]);

  const submitForm = async (data: ZonaEleitoralFormData) => {
    await onSubmit({
      numero: Number(data.numero),
      cidade: data.cidade.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[180px_1fr]">
        <div className="space-y-2">
          <Label htmlFor="numero" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Hash className="w-4 h-4" />
            Número
          </Label>
          <Input
            id="numero"
            type="number"
            min={1}
            placeholder="Zona"
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
          <Label htmlFor="cidade" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <MapPin className="w-4 h-4" />
            Cidade
          </Label>
          <Input
            id="cidade"
            placeholder="Cidade da zona eleitoral"
            className="h-11"
            maxLength={100}
            {...register("cidade", {
              required: "Cidade é obrigatória",
              minLength: { value: 2, message: "Informe pelo menos 2 caracteres" },
            })}
          />
          {errors.cidade && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.cidade.message}
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
