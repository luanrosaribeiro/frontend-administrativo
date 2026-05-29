import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CalendarDays, Hash, Save, UserCheck, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { listarCargos, type Cargo } from "../../services/cargoService";
import {
  type Candidato,
  type CandidatoFormPayload,
} from "../../services/candidatoService";
import { listarPartidos, type Partido } from "../../services/partidoService";

interface CandidatoFormProps {
  candidato?: Candidato | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (candidato: CandidatoFormPayload) => Promise<void>;
}

interface CandidatoFormData {
  nome: string;
  numero: number;
  partidoId: number;
  cargoId: number;
  eleicaoId: number;
}

export function CandidatoForm({
  candidato,
  isSubmitting,
  onCancel,
  onSubmit,
}: CandidatoFormProps) {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [erroListas, setErroListas] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidatoFormData>({
    defaultValues: {
      nome: "",
      numero: 0,
      partidoId: 0,
      cargoId: 0,
      eleicaoId: 0,
    },
  });

  useEffect(() => {
    async function carregarListas() {
      setErroListas("");

      try {
        const [partidosDados, cargosDados] = await Promise.all([
          listarPartidos(),
          listarCargos(),
        ]);

        setPartidos(partidosDados);
        setCargos(cargosDados);
      } catch (error) {
        setErroListas(
          error instanceof Error
            ? error.message
            : "Erro ao carregar partidos e cargos.",
        );
      }
    }

    void carregarListas();
  }, []);

  useEffect(() => {
    reset({
      nome: candidato?.nome ?? "",
      numero: candidato?.numero ?? 0,
      partidoId: candidato?.partido?.id ?? 0,
      cargoId: candidato?.cargo?.id ?? 0,
      eleicaoId: candidato?.eleicao?.id ?? 0,
    });
  }, [candidato, reset]);

  const submitForm = async (data: CandidatoFormData) => {
    await onSubmit({
      nome: data.nome.trim(),
      numero: Number(data.numero),
      partidoId: Number(data.partidoId),
      cargoId: Number(data.cargoId),
      eleicaoId: Number(data.eleicaoId),
    });
  };

  const selectClassName =
    "border-input bg-input-background flex h-11 w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {erroListas && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {erroListas}
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <UserCheck className="w-4 h-4" />
            Nome
          </Label>
          <Input
            id="nome"
            placeholder="Nome do candidato"
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
          <Label htmlFor="numero" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <Hash className="w-4 h-4" />
            Número
          </Label>
          <Input
            id="numero"
            type="number"
            min={1}
            placeholder="Número de urna"
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

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="partidoId" style={{ color: "#66BB6A" }}>
            Partido
          </Label>
          <select
            id="partidoId"
            className={selectClassName}
            {...register("partidoId", {
              required: "Partido é obrigatório",
              valueAsNumber: true,
              min: { value: 1, message: "Selecione um partido" },
            })}
          >
            <option value={0}>Selecione</option>
            {partidos.map((partido) => (
              <option key={partido.id} value={partido.id}>
                {partido.sigla} - {partido.nome}
              </option>
            ))}
          </select>
          {errors.partidoId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.partidoId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargoId" style={{ color: "#66BB6A" }}>
            Cargo
          </Label>
          <select
            id="cargoId"
            className={selectClassName}
            {...register("cargoId", {
              required: "Cargo é obrigatório",
              valueAsNumber: true,
              min: { value: 1, message: "Selecione um cargo" },
            })}
          >
            <option value={0}>Selecione</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id}>
                {cargo.nome}
              </option>
            ))}
          </select>
          {errors.cargoId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.cargoId.message}
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
            placeholder="ID"
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
