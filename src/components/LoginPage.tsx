import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Truck, TrendingDown, Clock, Shield } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleDriverLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/conductor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/src/feature/Logo.png" alt="OptiRoute Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-blue-900">OptiRoute</h1>
              <p className="text-xs text-gray-600">Sistema de Gestión de Rutas</p>
            </div>
          </div>
          <Button variant="outline">Soporte</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-blue-900 mb-4">Optimiza el transporte de tu equipo</h2>
              <p className="text-gray-700 text-lg">
                OptiRoute es la solución integral para gestionar rutas de transporte de empleados de manera eficiente, 
                reduciendo costos y mejorando la experiencia de tu equipo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <TrendingDown className="w-8 h-8 text-blue-700 mb-2" />
                  <p className="text-2xl text-blue-900 mb-1">35%</p>
                  <p className="text-sm text-gray-600">Reducción de costos</p>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <Clock className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-2xl text-orange-900 mb-1">20min</p>
                  <p className="text-sm text-gray-600">Ahorro promedio</p>
                </CardContent>
              </Card>
              <Card className="border-sky-200">
                <CardContent className="p-4">
                  <Users className="w-8 h-8 text-sky-600 mb-2" />
                  <p className="text-2xl text-sky-900 mb-1">98%</p>
                  <p className="text-sm text-gray-600">Satisfacción</p>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <Shield className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-2xl text-green-900 mb-1">100%</p>
                  <p className="text-sm text-gray-600">Seguro</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-blue-900">Beneficios principales:</h3>
              <ul className="space-y-2">
                {[
                  'Optimización automática de rutas',
                  'Monitoreo en tiempo real',
                  'Notificaciones automáticas',
                  'Reportes detallados de costos',
                  'Gestión de múltiples sedes',
                  'App móvil para conductores y empleados'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right side - Login */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>Selecciona tu tipo de usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="admin">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </TabsTrigger>
                  <TabsTrigger value="driver">
                    <Truck className="w-4 h-4 mr-2" />
                    Conductor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="admin">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Correo electrónico</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Contraseña</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
                      Acceder al Dashboard
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="driver">
                  <form onSubmit={handleDriverLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="driver-email">Correo electrónico</Label>
                      <Input
                        id="driver-email"
                        type="email"
                        placeholder="conductor@empresa.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driver-password">Contraseña</Label>
                      <Input
                        id="driver-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                      Ver mis rutas
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
