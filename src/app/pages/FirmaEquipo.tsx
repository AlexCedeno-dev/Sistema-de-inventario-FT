import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';

const API_BASE =
 import.meta.env.VITE_API_URL ||
 'http://localhost:3006';

export function FirmaEquipo() {

 const { token } = useParams();

 const sigRef =
 useRef<SignatureCanvas | null>(null);

 const [data,setData] =
 useState<any>(null);

 const [loading,setLoading] =
 useState(true);

 useEffect(()=>{
   cargarDatos();
 },[]);

 async function cargarDatos(){

   try{

    const res=
    await fetch(
      `${API_BASE}/firma/${token}/datos`
    );

    const json=
    await res.json();

    setData(json);

   }catch(err){
     alert(
      'No se pudo cargar firma'
     );
   }
   finally{
     setLoading(false);
   }
 }

 async function guardarFirma(){

   if(
     !sigRef.current ||
     sigRef.current.isEmpty()
   ){
     alert('Firme primero');
     return;
   }

   const firmaBase64=
   sigRef.current
    .getCanvas()
    .toDataURL('image/png');

   const res=
   await fetch(
    `${API_BASE}/firma/${token}/guardar`,
    {
      method:'POST',
      headers:{
       'Content-Type':
       'application/json'
      },
      body:JSON.stringify({
        firmaReceptorBase64:
        firmaBase64
      })
    }
   );

   const json=
   await res.json();

   if(!res.ok){
      alert(
        json.error ||
        'Error al guardar'
      );
      return;
   }

   alert(
    'Firma guardada correctamente'
   );

 }

 if(loading)
  return <div>Cargando...</div>;

 return(

<div className="
min-h-screen
bg-white
p-6
max-w-md
mx-auto
">

<h1 className="
text-xl
font-bold
mb-6
text-center
">
Firma de recepción
</h1>

<div className="
space-y-3
text-sm
mb-6
">
<p>
<b>Empleado:</b>
{data.nombre_completo}
</p>

<p>
<b>Equipo:</b>
{data.marca} {data.modelo}
</p>

<p>
<b>Serie:</b>
{data.service_tag}
</p>

<p>
<b>Entrega:</b>
{data.entregado_por}
</p>
</div>

<div className="
border
rounded
bg-white
">
<SignatureCanvas
 ref={sigRef}
 penColor="black"
 canvasProps={{
   width:350,
   height:220,
   className:
   'w-full'
 }}
/>
</div>

<button
 onClick={guardarFirma}
 className="
mt-6
w-full
bg-blue-700
text-white
py-3
rounded
"
>
Guardar Firma
</button>

</div>

 );
}