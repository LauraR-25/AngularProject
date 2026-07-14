import { Injectable } from '@angular/core';

/**
 * Contrato de datos que describe el estado celeste derivado de una fecha/hora.
 * Cualquier componente que necesite estos datos puede importar esta interfaz.
 */
export interface CelestialState {
  /** Porcentaje del día completo transcurrido (0–100) */
  dayProgress: number;
  /** true si la hora simulada está entre las 6:00 y las 18:00 */
  isDay: boolean;
  /** Posición horizontal del cuerpo celeste en % (rango 5–95) */
  bodyX: number;
  /** Posición vertical del cuerpo celeste en % (rango 5–70, parábola) */
  bodyY: number;
  /** Cadena CSS `linear-gradient` para el fondo del cielo según la franja horaria */
  skyGradient: string;
}

/**
 * TimeSimulatorService
 *
 * Servicio de responsabilidad única: recibe un objeto `Date` (ya con desfase
 * aplicado por `TimeService`) y devuelve un `CelestialState` con todos los
 * datos derivados listos para ser consumidos por la vista.
 *
 * No contiene estado propio ni suscripciones: es una función de transformación
 * pura encapsulada como servicio para poder ser inyectada y testeada de forma
 * aislada.
 */
@Injectable({ providedIn: 'root' })
export class TimeSimulatorService {

  /**
   * Calcula el estado celeste completo a partir de la fecha/hora del simulador.
   *
   * @param date - Fecha actual del simulador (con desfase ya aplicado).
   * @returns Un objeto `CelestialState` con todos los valores listos para la vista.
   */
  compute(date: Date): CelestialState {
    const hours   = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Segundos totales transcurridos desde medianoche (0–86399)
    const totalSecondsInDay = 86_400;
    const currentSeconds    = hours * 3600 + minutes * 60 + seconds;

    // --- Porcentaje del día (0–100) ---
    const dayProgress = (currentSeconds / totalSecondsInDay) * 100;

    // --- ¿Es de día? (franja 6:00–18:00) ---
    const isDay = hours >= 6 && hours < 18;

    // --- Posición del cuerpo celeste ---
    // Ciclo de 12 horas: el sol/luna recorre su arco completo en 43 200 segundos
    const cycleSeconds = currentSeconds % 43_200;

    // Horizontal: de 5% (izquierda) a 95% (derecha)
    const bodyX = (cycleSeconds / 43_200) * 90 + 5;

    // Vertical: parábola sen(0→π) → sube y baja suavemente (rango 5–70%)
    const arcAngle = (cycleSeconds / 43_200) * Math.PI;
    const bodyY    = Math.sin(arcAngle) * 65 + 5;

    // --- Gradiente del cielo según franja horaria ---
    const skyGradient = this.buildSkyGradient(currentSeconds);

    return { dayProgress, isDay, bodyX, bodyY, skyGradient };
  }

  // ─────────────────────────────────────────────────────────────────
  // Métodos privados de soporte
  // ─────────────────────────────────────────────────────────────────

  /**
   * Devuelve un `linear-gradient` CSS adaptado a la franja horaria del día.
   *
   * Franjas:
   *  - 0–6h   → Madrugada: negro profundo / azul medianoche
   *  - 6–7h   → Amanecer:  naranja / rosado / púrpura
   *  - 7–12h  → Mañana:    azul claro creciente
   *  - 12–16h → Tarde:     azul intenso
   *  - 16–19h → Atardecer: dorado / naranja
   *  - 19–24h → Noche:     negro estelar
   */
  private buildSkyGradient(secs: number): string {
    if (secs < 21_600) {
      // Madrugada (0–6h)
      const t = secs / 21_600;
      return `linear-gradient(to bottom, #000010 0%, #050a1a ${30 + t * 20}%, #0b1a35 100%)`;

    } else if (secs < 25_200) {
      // Amanecer (6–7h)
      return `linear-gradient(to bottom, #1a0a2e 0%, #8b2252 30%, #e8621a 65%, #f9a743 100%)`;

    } else if (secs < 43_200) {
      // Mañana (7–12h)
      const t = (secs - 25_200) / (43_200 - 25_200);
      return `linear-gradient(to bottom, #1c6ab0 0%, #3a9bd5 ${40 + t * 20}%, #87ceeb 100%)`;

    } else if (secs < 57_600) {
      // Tarde (12–16h)
      return `linear-gradient(to bottom, #0a4a8c 0%, #1a6bb8 40%, #5aace0 100%)`;

    } else if (secs < 68_400) {
      // Atardecer (16–19h)
      return `linear-gradient(to bottom, #0d1b4b 0%, #7b2d5c 25%, #e85d1a 55%, #f4a800 100%)`;

    } else {
      // Noche (19–24h)
      const t = (secs - 68_400) / (86_400 - 68_400);
      return `linear-gradient(to bottom, #000005 0%, #03051a ${20 + t * 15}%, #060e24 100%)`;
    }
  }
}
