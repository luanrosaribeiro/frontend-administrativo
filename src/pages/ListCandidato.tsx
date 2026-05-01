import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, Edit, Trash2, UserCheck } from "lucide-react";

interface Candidato {
  id: number;
  nome: string;
  numero: string;
  partido: string;
  cargo: string;
  foto?: string;
}

export function ListCandidato() {
  const [candidatos] = useState<Candidato[]>([
    { id: 1, nome: "João Silva", numero: "1234", partido: "Partido A", cargo: "Prefeito" },
    { id: 2, nome: "Maria Santos", numero: "5678", partido: "Partido B", cargo: "Vereador" },
    { id: 3, nome: "Pedro Oliveira", numero: "9012", partido: "Partido C", cargo: "Vereador" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: '#66BB6A' }}>
            <UserCheck className="w-8 h-8" />
            Candidatos
          </h1>
          <p className="text-gray-600 mt-1">Gerencie os candidatos do sistema eleitoral</p>
        </div>
        <Button className="flex items-center gap-2" style={{ backgroundColor: '#66BB6A', color: 'white' }}>
          <Plus className="w-4 h-4" />
          Novo Candidato
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar candidato por nome ou número..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {candidatos.map((candidato) => (
          <Card key={candidato.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-gray-400" style={{ color: '#66BB6A' }}/>
                  </div>
                  <div>
                    <h3 className="text-lg">{candidato.nome}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span>Número: <strong>{candidato.numero}</strong></span>
                      <span>-</span>
                      <span>{candidato.partido}</span>
                      <span>-</span>
                      <span>{candidato.cargo}</span>
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
