import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');
    
    setTimeout(() => {
      if (data.username === 'admin' && data.password === 'admin') {
        localStorage.setItem('token', 'fake-token');
        navigate('/dashboard');
      } else {
        setLoginError('Usuário ou senha inválido. Tente novamente.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#66BB6A' }}>
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl mb-2" style={{ color: '#66BB6A' }}>Sistema de Votação</h1>
          <p className="text-gray-600">Área Administrativa</p>
        </div>

        <Card className="border-2 shadow-xl" style={{ borderColor: '#66BB6A' }}>
          <CardHeader className="space-y-1 pb-6" style={{ backgroundColor: '#66BB6A' }}>
            <CardTitle className="text-2xl text-center text-white">Acesso Administrativo</CardTitle>
            <CardDescription className="text-center text-white/90">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2" style={{ color: '#66BB6A' }}>
                  <User className="w-4 h-4" />
                  Usuário
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    className="pl-4 pr-4 h-12 border-2 focus:border-yellow-400 transition-colors"
                    style={{ borderColor: errors.username ? '#d32f2f' : '#e0e0e0' }}
                    {...register('username', { 
                      required: 'Usuário é obrigatório',
                      minLength: { value: 3, message: 'Mínimo de 3 caracteres' }
                    })}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2" style={{ color: '#66BB6A' }}>
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="pl-4 pr-4 h-12 border-2 focus:border-yellow-400 transition-colors"
                    style={{ borderColor: errors.password ? '#d32f2f' : '#e0e0e0' }}
                    {...register('password', { 
                      required: 'Senha é obrigatória',
                      minLength: { value: 4, message: 'Mínimo de 4 caracteres' }
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
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
                  backgroundColor: '#FFFFFF', 
                  color: '#66BB6A',
                  border: '2px solid #66BB6A'
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Autenticando...
                  </span>
                ) : (
                  'Login'
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