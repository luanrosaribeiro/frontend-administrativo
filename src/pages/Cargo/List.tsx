import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, Edit, Trash2, Briefcase } from "lucide-react";

interface Cargo {
  id: number;
  nome: string;
  descricao: string;
  quantidadeVagas: number;
}

export function ListCargo() {
  const [cargos] = useState<Cargo[]>([
    { id: 1, nome: "Prefeito", descricao: "Chefe do Poder Executivo Municipal", quantidadeVagas: 1 },
    { id: 2, nome: "Vice-Prefeito", descricao: "Substituto do Prefeito", quantidadeVagas: 1 },
    { id: 3, nome: "Vereador", descricao: "Membro do Poder Legislativo Municipal", quantidadeVagas: 15 },
  ]);

  const [busca, setBusca] = useState("");

  const cargosFiltrados = cargos.filter((cargo) => {
    const termo = busca.toLowerCase().trim();
    return (
      cargo.nome.toLowerCase().includes(termo) ||
      cargo.descricao.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: '#66BB6A' }}>
            <Briefcase className="w-8 h-8" />
            Cargos
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento dos cargos disponíveis para votação.</p>
        </div>
        <Button className="flex items-center gap-2" style={{ backgroundColor: '#66BB6A', color: 'white' }}>
          <Plus className="w-4 h-4" />
          Novo Cargo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar cargo..."
                  className="pl-10"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {cargosFiltrados.length > 0 ? (
          cargosFiltrados.map((cargo) => (
            <Card key={cargo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-200">
                      <Briefcase className="w-8 h-8" style={{ color: '#66BB6A' }} />
                    </div>
                    <div>
                      <h3 className="text-lg">{cargo.nome}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>{cargo.descricao}</span>
                        <span>-</span>
                        <span>Vagas: {cargo.quantidadeVagas}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              Nenhum cargo encontrado para "<strong>{busca}</strong>".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}