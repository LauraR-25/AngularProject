export interface InfoFecha {
  dia: string;
  mes: string;
  anio: number;
  estacion: 'primavera' | 'verano' | 'otono' | 'invierno';
}

export function obtenerInfoFechaYEstacion(fecha: Date): InfoFecha {
  // Asegura dos dígitos para el día (ej: "05")
  const dia = fecha.getDate().toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const mesTexto = nombresMeses[fecha.getMonth()];

  const mes = fecha.getMonth();
  const diaNum = fecha.getDate();
  let estacion: 'primavera' | 'verano' | 'otono' | 'invierno' = 'verano';

  // Cálculo de estaciones (Hemisferio Norte)
  if ((mes === 2 && diaNum >= 21) || mes === 3 || mes === 4 || (mes === 5 && diaNum <= 20)) {
    estacion = 'primavera';
  } else if ((mes === 5 && diaNum >= 21) || mes === 6 || mes === 7 || (mes === 8 && diaNum <= 22)) {
    estacion = 'verano';
  } else if ((mes === 8 && diaNum >= 23) || mes === 9 || mes === 10 || (mes === 11 && diaNum <= 20)) {
    estacion = 'otono';
  } else {
    estacion = 'invierno';
  }

  return {
    dia,
    mes: mesTexto,
    anio,
    estacion
  };
}