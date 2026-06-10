import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, FileText, MapPinned, Save, User, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { Eleitor, EleitorFormPayload } from "../../services/eleitorService";
import {
  listarSecoesEleitorais,
  obterNomeZonaSecao,
  type SecaoEleitoral,
} from "../../services/secaoEleitoralService";

interface EleitorFormProps {
  eleitor?: Eleitor | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (eleitor: EleitorFormPayload) => Promise<void>;
}

interface EleitorFormData {
  nome: string;
  cpf: string;
  titulo: string;
  secaoId: number;
}

export function EleitorForm({
  eleitor,
  isSubmitting,
  onCancel,
  onSubmit,
}: EleitorFormProps) {
  const [secoes, setSecoes] = useState<SecaoEleitoral[]>([]);
  const [erroSecoes, setErroSecoes] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EleitorFormData>({
    defaultValues: {
      nome: "",
      cpf: "",
      titulo: "",
      secaoId: 0,
    },
  });

  const obterValoresFormulario = (eleitorAtual?: Eleitor | null): EleitorFormData => ({
    nome: eleitorAtual?.nome ?? "",
    cpf: eleitorAtual?.cpf ?? "",
    titulo: eleitorAtual?.titulo ?? "",
    secaoId: eleitorAtual?.secao?.id ?? 0,
  });

  useEffect(() => {
    async function carregarSecoes() {
      setErroSecoes("");

      try {
        const dados = await listarSecoesEleitorais();
        setSecoes(dados);
      } catch (error) {
        setErroSecoes(
          error instanceof Error ? error.message : "Erro ao carregar seções eleitorais.",
        );
      }
    }

    void carregarSecoes();
  }, []);

  useEffect(() => {
    reset(obterValoresFormulario(eleitor));
  }, [eleitor, reset]);

  useEffect(() => {
    if (!eleitor || secoes.length === 0) {
      return;
    }

    reset(obterValoresFormulario(eleitor));
  }, [eleitor, secoes.length, reset]);

  const submitForm = async (data: EleitorFormData) => {
    await onSubmit({
      nome: data.nome.trim(),
      cpf: data.cpf.trim(),
      titulo: data.titulo.trim(),
      secaoId: Number(data.secaoId),
    });
  };

  const selectClassName =
    "border-input bg-input-background flex h-11 w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {erroSecoes && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {erroSecoes}
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <User className="w-4 h-4" />
            Nome
          </Label>
          <Input
            id="nome"
            placeholder="Nome do eleitor"
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

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="titulo" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
            <FileText className="w-4 h-4" />
            Título
          </Label>
          <Input
            id="titulo"
            placeholder="Título de eleitor"
            className="h-11"
            maxLength={13}
            {...register("titulo", {
              required: "Título é obrigatório",
              pattern: {
                value: /^\d{1,13}$/,
                message: "Informe até 13 números",
              },
            })}
          />
          {errors.titulo && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.titulo.message}
            </p>
          )}
        </div>

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
