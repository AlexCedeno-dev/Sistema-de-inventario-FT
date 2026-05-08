export function formatearFechaMX(
  fecha: string | Date | null | undefined,
  opciones?: {
    conHora?: boolean;
    textoVacio?: string;
  }
) {
  const { conHora = true, textoVacio = 'N/A' } = opciones || {};

  if (!fecha) return textoVacio;

  if (typeof fecha === 'string') {
    const fechaSoloDia = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (fechaSoloDia && !conHora) {
      const [, year, month, day] = fechaSoloDia;

      return `${day}/${month}/${year}`;
    }
  }

  const date = fecha instanceof Date ? fecha : new Date(fecha);

  if (isNaN(date.getTime())) return textoVacio;

  return date.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(conHora
      ? {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }
      : {}),
  });
}

export function formatearFechaCortaMX(
  fecha: string | Date | null | undefined
) {
  return formatearFechaMX(fecha, {
    conHora: false,
  });
}