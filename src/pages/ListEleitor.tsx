import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, Edit, Trash2, Users, CheckCircle, XCircle } from "lucide-react";

interface Eleitor {
  id: number;
  nome: string;
  cpf: string;
  tituloEleitor: string;
  secao: string;
  zona: string;
  status: "ativo" | "inativo";
}

export function ListEleitor() {
  const [eleitores] = useState<Eleitor[]>([
    { id: 1, nome: "João Silva", cpf: "123.456.789-00", tituloEleitor: "1234 5678 9012", secao: "001", zona: "100", status: "ativo" },
    { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", tituloEleitor: "9876 5432 1098", secao: "002", zona: "100", status: "ativo" },
    { id: 3, nome: "Pedro Oliveira", cpf: "456.789.123-00", tituloEleitor: "4567 8912 3456", secao: "001", zona: "101", status: "inativo" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3" style={{ color: '#66BB6A' }}>
            <Users className="w-8 h-8" />
            Eleitores
          </h1>
          <p className="text-gray-600 mt-1">Gerencie os eleitores cadastrados no sistema</p>
        </div>
        <Button className="flex items-center gap-2" style={{ backgroundColor: '#66BB6A', color: 'white' }}>
          <Plus className="w-4 h-4" />
          Novo Eleitor
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar eleitor por nome, CPF ou título..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {eleitores.map((eleitor) => (
          <Card key={eleitor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" style={{ color: '#66BB6A' }}/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg">{eleitor.nome}</h3>
                      {eleitor.status === "ativo" ? (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3"/>
                          Ativo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Inativo
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span>CPF: {eleitor.cpf}</span>
                      <span>-</span>
                      <span>Título: {eleitor.tituloEleitor}</span>
                      <span>-</span>
                      <span>Seção: {eleitor.secao}</span>
                      <span>-</span>
                      <span>Zona: {eleitor.zona}</span>
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
