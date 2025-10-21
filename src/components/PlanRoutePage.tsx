import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar, MapPin, Truck, Users, AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const employees = [
  { id: 'EMP-001', name: 'Juan Pérez', address: 'Calle 123 #45-67, Bogotá', department: 'Ventas' },
  { id: 'EMP-002', name: 'María García', address: 'Carrera 45 #12-34, Bogotá', department: 'Marketing' },
  { id: 'EMP-003', name: 'Carlos Rodríguez', address: 'Avenida 68 #23-45, Bogotá', department: 'IT' },
  { id: 'EMP-005', name: 'Luis Fernández', address: 'Carrera 7 #56-78, Bogotá', department: 'Finanzas' },
  { id: 'EMP-006', name: 'Sofia López', address: 'Calle 85 #67-89, Bogotá', department: 'Operaciones' },
  { id: 'EMP-007', name: 'Pedro Gómez', address: 'Calle 100 #15-30, Bogotá', department: 'Ventas' },
  { id: 'EMP-008', name: 'Laura Torres', address: 'Carrera 30 #45-60, Bogotá', department: 'Marketing' },
];

const vehicles = [
  { id: 'VEH-001', name: 'Bus Mercedes 001', capacity: 45, status: 'Disponible' },
  { id: 'VEH-002', name: 'Bus Volvo 002', capacity: 50, status: 'Disponible' },
  { id: 'VEH-003', name: 'Van Toyota 003', capacity: 15, status: 'Disponible' },
  { id: 'VEH-004', name: 'Minibus Chevrolet 004', capacity: 25, status: 'Disponible' },
];

export function PlanRoutePage() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [date, setDate] = useState('2024-10-22');
  const [shift, setShift] = useState('');
  const [sede, setSede] = useState('');

  const vehicle = vehicles.find(v => v.id === selectedVehicle);
  const capacityUsed = selectedEmployees.length;
  const capacityTotal = vehicle?.capacity || 0;
  const capacityPercentage = capacityTotal > 0 ? (capacityUsed / capacityTotal) * 100 : 0;

  const toggleEmployee = (empId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(empId) 
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    );
  };

  const handleGenerateRoute = () => {
    if (!selectedVehicle || selectedEmployees.length === 0 || !shift || !sede) {
      alert('Por favor completa todos los campos');
      return;
    }
    navigate('/dashboard/ruta-generada');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Planificar Nueva Ruta</h1>
          <p className="text-gray-600">Configura los parámetros y selecciona los empleados para generar una ruta optimizada</p>
        </div>
        <Button 
          className="bg-blue-700 hover:bg-blue-800"
          onClick={handleGenerateRoute}
          disabled={!selectedVehicle || selectedEmployees.length === 0 || !shift || !sede}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generar Ruta Optimizada
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Configuración de Ruta
              </CardTitle>
              <CardDescription>Define los parámetros básicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Select value={shift} onValueChange={setShift}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Matutino (07:00 AM)</SelectItem>
                    <SelectItem value="afternoon">Vespertino (02:00 PM)</SelectItem>
                    <SelectItem value="night">Nocturno (10:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sede">Sede Destino</Label>
                <Select value={sede} onValueChange={setSede}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="norte">Sede Norte</SelectItem>
                    <SelectItem value="sur">Sede Sur</SelectItem>
                    <SelectItem value="centro">Sede Centro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Selección de Vehículo
              </CardTitle>
              <CardDescription>Elige el vehículo para esta ruta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedVehicle === v.id
                      ? 'border-blue-700 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{v.name}</p>
                    <Badge className="bg-green-100 text-green-800">
                      {v.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Capacidad: {v.capacity} pasajeros</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedVehicle && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">Capacidad del Vehículo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Ocupación</span>
                    <span className="text-gray-900">
                      {capacityUsed} / {capacityTotal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        capacityPercentage > 90 ? 'bg-red-600' :
                        capacityPercentage > 70 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    />
                  </div>
                  {capacityPercentage > 100 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Has excedido la capacidad del vehículo
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Employees Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Selección de Empleados
            </CardTitle>
            <CardDescription>
              Selecciona los empleados que viajarán en esta ruta ({selectedEmployees.length} seleccionados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => toggleEmployee(emp.id)}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedEmployees.includes(emp.id)
                      ? 'border-blue-700 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Checkbox
                    checked={selectedEmployees.includes(emp.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-900">{emp.name}</p>
                      <Badge variant="outline">{emp.department}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{emp.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
