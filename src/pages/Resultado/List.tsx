import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  FileDown,
  Hash,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { listarCargos, type Cargo } from "../../services/cargoService";
import { listarEleicoes, obterNomeEleicao, type Eleicao } from "../../services/eleicaoService";
import { listarPartidos, type Partido } from "../../services/partidoService";
import {
  listarResultados,
  listarResultadosPorEleicao,
  obterNomeCandidato,
  obterNomeEleicaoResultado,
  obterNomeRelacaoResultado,
  obterNomeUfResultado,
  type ResultadoVoto,
} from "../../services/resultadoService";

type FiltrosResultado = {
  eleicaoId: number;
  cargoId: number;
  partidoId: number;
  uf: string;
};

function escaparHtml(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function ListResultado() {
  const [resultados, setResultados] = useState<ResultadoVoto[]>([]);
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [busca, setBusca] = useState("");
  const [filtros, setFiltros] = useState<FiltrosResultado>({
    eleicaoId: 0,
    cargoId: 0,
    partidoId: 0,
    uf: "",
  });
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const carregarListas = useCallback(async () => {
    const [eleicoesDados, cargosDados, partidosDados] = await Promise.all([
      listarEleicoes(),
      listarCargos(),
      listarPartidos(),
    ]);

    setEleicoes(eleicoesDados);
    setCargos(cargosDados);
    setPartidos(partidosDados);
  }, []);

  const carregarResultados = useCallback(async (eleicaoId: number) => {
    setIsLoading(true);
    setErro("");

    try {
      const dados =
        eleicaoId > 0 ? await listarResultadosPorEleicao(eleicaoId) : await listarResultados();

      setResultados(dados);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar resultados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function carregarDadosIniciais() {
      setIsLoading(true);
      setErro("");

      try {
        await Promise.all([carregarListas(), carregarResultados(0)]);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar resultados.");
        setIsLoading(false);
      }
    }

    void carregarDadosIniciais();
  }, [carregarListas, carregarResultados]);

  const resultadosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return resultados.filter((resultado) => {
      const candidato = resultado.candidato;
      const nomeCandidato = obterNomeCandidato(candidato).toLowerCase();
      const nomeEleicao = obterNomeEleicaoResultado(resultado.eleicao).toLowerCase();
      const partido = obterNomeRelacaoResultado(candidato?.partido).toLowerCase();
      const cargo = obterNomeRelacaoResultado(candidato?.cargo).toLowerCase();
      const uf = obterNomeUfResultado(candidato?.uf).toLowerCase();
      const numero = candidato?.numero !== undefined ? String(candidato.numero) : "";

      const correspondeBusca =
        !termo ||
        nomeCandidato.includes(termo) ||
        nomeEleicao.includes(termo) ||
        partido.includes(termo) ||
        cargo.includes(termo) ||
        uf.includes(termo) ||
        numero.includes(termo);

      const correspondeCargo =
        filtros.cargoId === 0 || candidato?.cargo?.id === filtros.cargoId;
      const correspondePartido =
        filtros.partidoId === 0 || candidato?.partido?.id === filtros.partidoId;
      const correspondeUf = !filtros.uf || candidato?.uf?.sigla === filtros.uf;

      return correspondeBusca && correspondeCargo && correspondePartido && correspondeUf;
    });
  }, [busca, filtros.cargoId, filtros.partidoId, filtros.uf, resultados]);

  const ufsDisponiveis = useMemo(() => {
    const ufs = new Map<string, string>();

    resultados.forEach((resultado) => {
      const uf = resultado.candidato?.uf;

      if (!uf?.sigla) {
        return;
      }

      ufs.set(uf.sigla, obterNomeUfResultado(uf));
    });

    return Array.from(ufs, ([sigla, nome]) => ({ sigla, nome })).sort((ufAtual, proximaUf) =>
      ufAtual.sigla.localeCompare(proximaUf.sigla),
    );
  }, [resultados]);

  const resultadosOrdenados = useMemo(() => {
    return [...resultadosFiltrados].sort(
      (resultadoAtual, proximoResultado) =>
        (proximoResultado.totalVotos ?? 0) - (resultadoAtual.totalVotos ?? 0),
    );
  }, [resultadosFiltrados]);

  const totalVotos = useMemo(
    () => resultadosOrdenados.reduce((total, resultado) => total + (resultado.totalVotos ?? 0), 0),
    [resultadosOrdenados],
  );

  const alterarEleicao = (valor: string) => {
    const eleicaoId = Number(valor);

    setFiltros((filtrosAtuais) => ({
      ...filtrosAtuais,
      eleicaoId,
    }));

    void carregarResultados(eleicaoId);
  };

  const limparFiltros = () => {
    setBusca("");
    setFiltros({
      eleicaoId: 0,
      cargoId: 0,
      partidoId: 0,
      uf: "",
    });
    void carregarResultados(0);
  };

  const exportarPdf = () => {
    const linhas = resultadosOrdenados
      .map((resultado, index) => {
        const candidato = resultado.candidato;
        const percentual =
          totalVotos > 0 ? (((resultado.totalVotos ?? 0) / totalVotos) * 100).toFixed(1) : "0.0";

        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escaparHtml(obterNomeCandidato(candidato))}</td>
            <td>${escaparHtml(candidato?.numero !== undefined ? String(candidato.numero) : "-")}</td>
            <td>${escaparHtml(obterNomeRelacaoResultado(candidato?.partido) || "-")}</td>
            <td>${escaparHtml(obterNomeRelacaoResultado(candidato?.cargo) || "-")}</td>
            <td>${escaparHtml(obterNomeEleicaoResultado(resultado.eleicao) || "-")}</td>
            <td>${resultado.totalVotos ?? 0}</td>
            <td>${percentual}%</td>
          </tr>
        `;
      })
      .join("");

    const janela = window.open("", "_blank");

    if (!janela) {
      setErro("Não foi possível abrir a janela de exportação.");
      return;
    }

    janela.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Resultados da apuração</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
            h1 { color: #2f7d32; margin-bottom: 4px; }
            p { color: #4b5563; margin-top: 0; }
            table { border-collapse: collapse; width: 100%; margin-top: 24px; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; }
            td:nth-child(1), td:nth-child(7), td:nth-child(8) { text-align: right; }
          </style>
        </head>
        <body>
          <h1>Resultados da apuração</h1>
          <table>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Candidato</th>
                <th>Número</th>
                <th>Partido</th>
                <th>Cargo</th>
                <th>Eleição</th>
                <th>Votos</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${linhas || '<tr><td colspan="8">Nenhum resultado encontrado.</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    janela.print();
  };

  const selectClassName =
    "border-input bg-input-background flex h-11 w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: "#66BB6A" }}>
            <BarChart3 className="w-8 h-8" />
            Resultados
          </h1>
          <p className="text-gray-600 mt-1">Apuração dos votos registrados por candidato.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportarPdf}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={() => void carregarResultados(filtros.eleicaoId)}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <div className="relative md:col-span-2 xl:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por candidato, número, partido, cargo ou eleição..."
                className="h-11 pl-10"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>

            <select
              className={selectClassName}
              value={filtros.eleicaoId}
              onChange={(event) => alterarEleicao(event.target.value)}
            >
              <option value={0}>Todas as eleições</option>
              {eleicoes.map((eleicao) => (
                <option key={eleicao.id} value={eleicao.id}>
                  {obterNomeEleicao(eleicao)}
                </option>
              ))}
            </select>

            <select
              className={selectClassName}
              value={filtros.cargoId}
              onChange={(event) =>
                setFiltros((filtrosAtuais) => ({
                  ...filtrosAtuais,
                  cargoId: Number(event.target.value),
                }))
              }
            >
              <option value={0}>Todos os cargos</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nome}
                </option>
              ))}
            </select>

            <select
              className={selectClassName}
              value={filtros.partidoId}
              onChange={(event) =>
                setFiltros((filtrosAtuais) => ({
                  ...filtrosAtuais,
                  partidoId: Number(event.target.value),
                }))
              }
            >
              <option value={0}>Todos os partidos</option>
              {partidos.map((partido) => (
                <option key={partido.id} value={partido.id}>
                  {partido.sigla} - {partido.nome}
                </option>
              ))}
            </select>

            <select
              className={selectClassName}
              value={filtros.uf}
              onChange={(event) =>
                setFiltros((filtrosAtuais) => ({
                  ...filtrosAtuais,
                  uf: event.target.value,
                }))
              }
            >
              <option value="">Todas as UFs</option>
              {ufsDisponiveis.map((uf) => (
                <option key={uf.sigla} value={uf.sigla}>
                  {uf.nome}
                </option>
              ))}
            </select>
          </div>

          {(busca ||
            filtros.eleicaoId > 0 ||
            filtros.cargoId > 0 ||
            filtros.partidoId > 0 ||
            filtros.uf) && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={limparFiltros}>
                <X className="w-4 h-4" />
                Limpar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {erro && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {erro}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Carregando resultados...
            </CardContent>
          </Card>
        ) : resultadosOrdenados.length > 0 ? (
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-right">Posição</TableHead>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Partido</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Eleição</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead className="text-right">Votos</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultadosOrdenados.map((resultado, index) => {
                  const candidato = resultado.candidato;
                  const partido = obterNomeRelacaoResultado(candidato?.partido);
                  const cargo = obterNomeRelacaoResultado(candidato?.cargo);
                  const eleicao = obterNomeEleicaoResultado(resultado.eleicao);
                  const uf = obterNomeUfResultado(candidato?.uf);
                  const percentual =
                    totalVotos > 0 ? ((resultado.totalVotos / totalVotos) * 100).toFixed(1) : "0.0";

                  return (
                    <TableRow key={resultado.id ?? `${candidato?.id}-${resultado.eleicao?.id}`}>
                      <TableCell className="text-right">{index + 1}</TableCell>
                      <TableCell>{obterNomeCandidato(candidato)}</TableCell>
                      <TableCell>
                        {candidato?.numero !== undefined ? (
                          <span className="inline-flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            {candidato.numero}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {partido ? (
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {partido}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {cargo ? (
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {cargo}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {eleicao ? (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {eleicao}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{uf || "-"}</TableCell>
                      <TableCell className="text-right font-medium">{resultado.totalVotos}</TableCell>
                      <TableCell className="text-right">{percentual}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Nenhum resultado encontrado para os filtros selecionados.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
