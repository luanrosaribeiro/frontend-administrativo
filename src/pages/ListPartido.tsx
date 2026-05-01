import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";

interface Partido {
  id: number;
  nome: string;
  sigla: string;
  numero: string;
  presidente: string;
}

export function ListPartido() {
  const [partidos] = useState<Partido[]>([
    { id: 1, nome: "Partido Democrático", sigla: "PD", numero: "12", presidente: "Carlos Silva" },
    { id: 2, nome: "Partido Popular", sigla: "PP", numero: "34", presidente: "Ana Costa" },
    { id: 3, nome: "Partido Liberal", sigla: "PL", numero: "56", presidente: "Roberto Santos" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: '#66BB6A' }}>
            <Building2 className="w-8 h-8" />
            Partidos
          </h1>
          <p className="text-gray-600 mt-1">Gerenciamento de partidos.</p>
        </div>
        <Button className="flex items-center gap-2" style={{ backgroundColor: '#66BB6A', color: 'white' }}>
          <Plus className="w-4 h-4" />
          Novo Partido
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar partido por nome ou sigla..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {partidos.map((partido) => (
          <Card key={partido.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xl bg-gray-200">
                    <span style={{ color: '#66BB6A' }}>{partido.sigla}</span>
                  </div>
                  <div>
                    <h3 className="text-lg">{partido.nome}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span>Número: {partido.numero}</span>
                      <span>-</span>
                      <span>Presidente: {partido.presidente}</span>
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
        ))}
      </div>
    </div>
  );
}
