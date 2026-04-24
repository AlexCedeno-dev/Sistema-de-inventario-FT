import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

type SignatureModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (firmas: {
    firmaITBase64: string;
    firmaReceptorBase64: string;
  }) => void;
};

export function SignatureModal({ open, onOpenChange, onSave }: SignatureModalProps) {
  const firmaITRef = useRef<SignatureCanvas | null>(null);
  const firmaReceptorRef = useRef<SignatureCanvas | null>(null);

  const handleClearIT = () => firmaITRef.current?.clear();
  const handleClearReceptor = () => firmaReceptorRef.current?.clear();

  const handleSave = () => {
    if (!firmaITRef.current || firmaITRef.current.isEmpty()) {
      alert('Falta la firma de quien entrega.');
      return;
    }

    if (!firmaReceptorRef.current || firmaReceptorRef.current.isEmpty()) {
      alert('Falta la firma del receptor.');
      return;
    }

    onSave({
      firmaITBase64: firmaITRef.current.getCanvas().toDataURL('image/png'),
      firmaReceptorBase64: firmaReceptorRef.current.getCanvas().toDataURL('image/png'),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Firmas de entrega</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Firma de quien entrega</h3>
            <div className="border rounded-lg bg-white">
              <SignatureCanvas
                ref={firmaITRef}
                penColor="black"
                canvasProps={{
                  width: 380,
                  height: 220,
                  className: 'w-full h-[220px]',
                }}
              />
            </div>
            <Button variant="outline" className="mt-2" onClick={handleClearIT}>
              Limpiar
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Firma del receptor</h3>
            <div className="border rounded-lg bg-white">
              <SignatureCanvas
                ref={firmaReceptorRef}
                penColor="black"
                canvasProps={{
                  width: 380,
                  height: 220,
                  className: 'w-full h-[220px]',
                }}
              />
            </div>
            <Button variant="outline" className="mt-2" onClick={handleClearReceptor}>
              Limpiar
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Firmas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}