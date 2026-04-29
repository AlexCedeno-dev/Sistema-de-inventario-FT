import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle
} from '../ui/alert-dialog';

export type TipoEntregador =
 | 'IT'
 | 'BECARIO';

interface EntregaDialogProps {
 open:boolean;

 onOpenChange:(open:boolean)=>void;

 onConfirm:(
 data:{
  entregadoPor:string;
  tipoEntregador:TipoEntregador;
 }
)=>void;
}

export function EntregaDialog({
 open,
 onOpenChange,
 onConfirm
}:EntregaDialogProps){

 const[
  entregadoPor,
  setEntregadoPor
 ]=useState('');

 const[
  tipoEntregador,
  setTipoEntregador
 ]=useState<TipoEntregador>(
   'IT'
 );

 useEffect(()=>{

 if(!open){
   setEntregadoPor('');
   setTipoEntregador('IT');
 }

 },[open]);

 return(

<AlertDialog
 open={open}
 onOpenChange={onOpenChange}
>

<AlertDialogContent className="max-w-md">

<AlertDialogHeader>

<AlertDialogTitle>
Generar Documento
</AlertDialogTitle>

<AlertDialogDescription>
¿Quién entrega laptop?
</AlertDialogDescription>

</AlertDialogHeader>

<div className="space-y-4 py-2">

<div>
<label className="text-sm font-medium">
Nombre de quien entrega:
</label>

<Input
value={entregadoPor}
onChange={(e)=>
 setEntregadoPor(
  e.target.value
 )
}
placeholder="Ej: Alejandro Cedeño"
className="mt-2"
/>

</div>

<div className="space-y-2">

<label className="flex items-center gap-2">

<input
type="radio"
checked={
 tipoEntregador==='IT'
}
onChange={()=>
 setTipoEntregador(
  'IT'
 )
}
/>

Empleado de IT

</label>

<label className="flex items-center gap-2">

<input
type="radio"
checked={
 tipoEntregador==='BECARIO'
}
onChange={()=>
 setTipoEntregador(
  'BECARIO'
 )
}
/>

Becario

</label>

</div>

</div>

<AlertDialogFooter>

<AlertDialogCancel>
Cancelar
</AlertDialogCancel>

<AlertDialogAction
disabled={
 !entregadoPor.trim()
}
onClick={()=>{

 onConfirm({
   entregadoPor:
   entregadoPor.trim(),

   tipoEntregador
 });

}}
>

Continuar

</AlertDialogAction>

</AlertDialogFooter>

</AlertDialogContent>

</AlertDialog>

 );

}