import { useEffect, useState } from 'react';
import { FileText, UserRound } from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type TipoEntregador = 'IT' | 'BECARIO';

interface EntregaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    entregadoPor: string;
    tipoEntregador: TipoEntregador;
  }) => void;
}

export function EntregaDialog({
  open,
  onOpenChange,
  onConfirm,
}: EntregaDialogProps) {
  const [entregadoPor, setEntregadoPor] = useState('');
  const [tipoEntregador, setTipoEntregador] = useState<TipoEntregador | ''>('');

  useEffect(() => {
    if (!open) {
      setEntregadoPor('');
      setTipoEntregador('');
    }
  }, [open]);

  const puedeContinuar =
    entregadoPor.trim().length > 0 &&
    tipoEntregador !== '';

  const handleSubmit = () => {
    if (!puedeContinuar) return;

    onConfirm({
      entregadoPor: entregadoPor.trim(),
      tipoEntregador,
    });

    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2">
              <FileText className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <AlertDialogTitle className="text-green-700">
                Generar documento
              </AlertDialogTitle>

              <AlertDialogDescription className="pt-1">
                Registra quién entrega el equipo antes de generar el QR de firma.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-800">
              Carta responsiva de equipo
            </p>
            <p className="mt-1">
              Esta información quedará guardada en el historial de entregas.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <UserRound className="h-4 w-4 text-slate-500" />
              Nombre de quien entrega
            </label>

            <Input
              value={entregadoPor}
              onChange={(e) => setEntregadoPor(e.target.value)}
              placeholder="Ej: Alejandro Cedeño"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Tipo de entregador
            </label>

            <Select
              value={tipoEntregador}
              onValueChange={(value) =>
                setTipoEntregador(value as TipoEntregador)
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="IT">Empleado de IT</SelectItem>
                <SelectItem value="BECARIO">Becario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancelar
          </AlertDialogCancel>

          <Button
            type="button"
            disabled={!puedeContinuar}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Continuar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}