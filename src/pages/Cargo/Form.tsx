import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Briefcase, ListChecks, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Cargo, CargoPayload } from "../../services/cargoService";

interface CargoFormProps {
  cargo?: Cargo | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (cargo: CargoPayload) => Promise<void>;
}

interface CargoFormData {
  nome: string;
  quantidadeVagas: number;
}

export function CargoForm({
  cargo,
  isSubmitting,
  onCancel,
  onSubmit,
}: CargoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CargoFormData>({
    defaultValues: {
      nome: "",
      quantidadeVagas: 1,
    },
  });

  useEffect(() => {
    reset({
      nome: cargo?.nome ?? "",
      quantidadeVagas: cargo?.quantidadeVagas ?? 1,
    });
  }, [cargo, reset]);

  const submitForm = async (data: CargoFormData) => {
    await onSubmit({
      nome: data.nome.trim(),
      quantidadeVagas: Number(data.quantidadeVagas),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Briefcase className="w-4 h-4" />
            Nome
          </Label>
          <Input
            id="nome"
            placeholder="Nome do cargo"
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
          <Label htmlFor="quantidadeVagas" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <ListChecks className="w-4 h-4" />
            Vagas
          </Label>
          <Input
            id="quantidadeVagas"
            type="number"
            min={1}
            className="h-11"
            {...register("quantidadeVagas", {
              required: "Vagas é obrigatório",
              valueAsNumber: true,
              min: { value: 1, message: "Informe pelo menos 1 vaga" },
            })}
          />
          {errors.quantidadeVagas && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.quantidadeVagas.message}
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
