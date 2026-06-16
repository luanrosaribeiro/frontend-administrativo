import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { AlertCircle, Lock, ShieldCheck, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { loginUsuario } from "../services/usuarioService";

interface LoginFormData {
  email: string;
  senha: string;
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const usuario = await loginUsuario(data.email, data.senha);
      const destino = location.state?.from?.pathname ?? "/dashboard";

      localStorage.setItem("token", JSON.stringify(usuario));
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate(destino, { replace: true });
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Usuário ou senha inválido. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: "#66BB6A" }}>
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl mb-2" style={{ color: "#66BB6A" }}>
            Sistema de Votação
          </h1>
          <p className="text-gray-600">Área Administrativa</p>
        </div>

        <Card className="border-2 shadow-xl" style={{ borderColor: "#66BB6A" }}>
          <CardHeader className="space-y-1 pb-6" style={{ backgroundColor: "#66BB6A" }}>
            <CardTitle className="text-2xl text-center text-white">
              Acesso Administrativo
            </CardTitle>
            <CardDescription className="text-center text-white/90">
              Digite seus dados para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
                  <User className="w-4 h-4" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="pl-4 pr-4 h-12 border-2 focus:border-yellow-400 transition-colors"
                  style={{ borderColor: errors.email ? "#d32f2f" : "#e0e0e0" }}
                  {...register("email", {
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Informe um e-mail válido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="flex items-center gap-2" style={{ color: "#66BB6A" }}>
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  className="pl-4 pr-4 h-12 border-2 focus:border-yellow-400 transition-colors"
                  style={{ borderColor: errors.senha ? "#d32f2f" : "#e0e0e0" }}
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: { value: 4, message: "Mínimo de 4 caracteres" },
                  })}
                />
                {errors.senha && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.senha.message}
                  </p>
                )}
              </div>

              {loginError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {loginError}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#66BB6A",
                  border: "2px solid #66BB6A",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Autenticando...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Sistema protegido por criptografia de ponta a ponta
              </p>
              <p className="text-xs text-center text-gray-400 mt-1">
                Em caso de problemas, contate o administrador do sistema
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sistema de Votação Eletrônica © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
