import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, MapPin, MapPinned, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type {
  SecaoEleitoral,
  SecaoEleitoralFormPayload,
} from "../../services/secaoEleitoralService";
import { listarZonasEleitorais, type ZonaEleitoral } from "../../services/zonaEleitoralService";

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
  const [zonas, setZonas] = useState<ZonaEleitoral[]>([]);
  const [erroZonas, setErroZonas] = useState("");

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

  const obterValoresFormulario = (secaoAtual?: SecaoEleitoral | null): SecaoEleitoralFormData => ({
    local: secaoAtual?.local ?? "",
    zonaId: secaoAtual?.zona?.id ?? 0,
  });

  useEffect(() => {
    async function carregarZonas() {
      setErroZonas("");

      try {
        const dados = await listarZonasEleitorais();
        setZonas(dados);
      } catch (error) {
        setErroZonas(
          error instanceof Error ? error.message : "Erro ao carregar zonas eleitorais.",
        );
      }
    }

    void carregarZonas();
  }, []);

  useEffect(() => {
    reset(obterValoresFormulario(secao));
  }, [reset, secao]);

  useEffect(() => {
    if (!secao || zonas.length === 0) {
      return;
    }

    reset(obterValoresFormulario(secao));
  }, [reset, secao, zonas.length]);

  const submitForm = async (data: SecaoEleitoralFormData) => {
    await onSubmit({
      local: data.local.trim(),
      zonaId: Number(data.zonaId),
    });
  };

  const selectClassName =
    "border-input bg-input-background flex h-11 w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {erroZonas && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {erroZonas}
          </p>
        </div>
      )}

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
          <select
            id="zonaId"
            className={selectClassName}
            {...register("zonaId", {
              required: "Zona é obrigatória",
              valueAsNumber: true,
              min: { value: 1, message: "Selecione uma zona" },
            })}
          >
            <option value={0}>
              {zonas.length > 0 ? "Selecione" : "Nenhuma zona cadastrada"}
            </option>
            {zonas.map((zona) => (
              <option key={zona.id} value={zona.id}>
                Zona {zona.numero} - {zona.cidade}
              </option>
            ))}
          </select>
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
