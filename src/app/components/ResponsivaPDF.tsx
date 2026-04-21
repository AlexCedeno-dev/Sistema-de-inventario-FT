type ResponsivaPDFProps = {
  data: {
    nombre: string;
    departamento: string;
    marca: string;
    modelo: string;
    service_tag: string;
    fecha: string;
    specs: string;
  };
};

export function ResponsivaPDF({ data }: ResponsivaPDFProps) {
  return (
    <div
      id="pdf-content"
      style={{
        width: '816px',
        minHeight: '1056px',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          margin: '0 0 30px 0',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000000',
        }}
      >
        RESPONSIVA DE EQUIPO DE CÓMPUTO
      </h2>

      <p style={{ fontSize: '16px', color: '#000000', marginBottom: '16px' }}>
        Mediante este documento, el área de sistemas hace entrega del equipo:
      </p>

      <p style={{ color: '#000000' }}><strong>Empleado:</strong> {data.nombre}</p>
      <p style={{ color: '#000000' }}><strong>Departamento:</strong> {data.departamento}</p>
      <p style={{ color: '#000000' }}><strong>Marca:</strong> {data.marca}</p>
      <p style={{ color: '#000000' }}><strong>Modelo:</strong> {data.modelo}</p>
      <p style={{ color: '#000000' }}><strong>Service Tag:</strong> {data.service_tag}</p>
      <p style={{ color: '#000000' }}><strong>Fecha:</strong> {data.fecha}</p>
      <p style={{ color: '#000000' }}><strong>Especificaciones:</strong> {data.specs}</p>

      <div
        style={{
          marginTop: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '40px',
        }}
      >
        <div style={{ width: '45%', textAlign: 'center', color: '#000000' }}>
          <div style={{ borderTop: '1px solid #000000', paddingTop: '8px' }}>
            Departamento de IT
          </div>
        </div>

        <div style={{ width: '45%', textAlign: 'center', color: '#000000' }}>
          <div style={{ borderTop: '1px solid #000000', paddingTop: '8px' }}>
            Receptor
          </div>
        </div>
      </div>
    </div>
  );
}