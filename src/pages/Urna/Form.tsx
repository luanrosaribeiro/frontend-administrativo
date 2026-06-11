import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CalendarDays, Hash, MapPinned, Power, Save, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Urna, UrnaFormPayload } from "../../services/urnaService";
import { listarEleicoes, obterNomeEleicao, type Eleicao } from "../../services/eleicaoService";
import {
  listarSecoesEleitorais,
  obterNomeZonaSecao,
  type SecaoEleitoral,
} from "../../services/secaoEleitoralService";

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
  const [secoes, setSecoes] = useState<SecaoEleitoral[]>([]);
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [erroListas, setErroListas] = useState("");

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

  const obterValoresFormulario = (urnaAtual?: Urna | null): UrnaFormData => ({
    numero: urnaAtual?.numero ?? 0,
    status: urnaAtual?.status ?? "",
    secaoId: urnaAtual?.secao?.id ?? 0,
    eleicaoId: urnaAtual?.eleicao?.id ?? 0,
  });

  useEffect(() => {
    async function carregarListas() {
      setErroListas("");

      try {
        const [secoesDados, eleicoesDados] = await Promise.all([
          listarSecoesEleitorais(),
          listarEleicoes(),
        ]);

        setSecoes(secoesDados);
        setEleicoes(eleicoesDados);
      } catch (error) {
        setErroListas(
          error instanceof Error ? error.message : "Erro ao carregar seções e eleições.",
        );
      }
    }

    void carregarListas();
  }, []);

  useEffect(() => {
    reset(obterValoresFormulario(urna));
  }, [reset, urna]);

  useEffect(() => {
    if (!urna || secoes.length === 0 || eleicoes.length === 0) {
      return;
    }

    reset(obterValoresFormulario(urna));
  }, [reset, urna, secoes.length, eleicoes.length]);

  const submitForm = async (data: UrnaFormData) => {
    await onSubmit({
      numero: Number(data.numero),
      status: data.status.trim(),
      secaoId: Number(data.secaoId),
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
          <select
            id="status"
            className={selectClassName}
            {...register("status", {
              required: "Status é obrigatório",
            })}
          >
            <option value="">Selecione</option>
            <option value="ATIVA">Ativa</option>
            <option value="INATIVA">Inativa</option>
          </select>
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
          <select
            id="secaoId"
            className={selectClassName}
            {...register("secaoId", {
              required: "Seção é obrigatória",
              valueAsNumber: true,
              min: { value: 1, message: "Selecione uma seção" },
            })}
          >
            <option value={0}>
              {secoes.length > 0 ? "Selecione" : "Nenhuma seção cadastrada"}
            </option>
            {secoes.map((secao) => {
              const zona = obterNomeZonaSecao(secao.zona);
              const nomeSecao = secao.local || (secao.id ? `Seção #${secao.id}` : "Seção");

              return (
                <option key={secao.id} value={secao.id}>
                  {zona ? `${nomeSecao} - ${zona}` : nomeSecao}
                </option>
              );
            })}
          </select>
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
          <select
            id="eleicaoId"
            className={selectClassName}
            {...register("eleicaoId", {
              required: "Eleição é obrigatória",
              valueAsNumber: true,
              min: { value: 1, message: "Selecione uma eleição" },
            })}
          >
            <option value={0}>
              {eleicoes.length > 0 ? "Selecione" : "Nenhuma eleição cadastrada"}
            </option>
            {eleicoes.map((eleicao) => (
              <option key={eleicao.id} value={eleicao.id}>
                {obterNomeEleicao(eleicao)}
              </option>
            ))}
          </select>
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
