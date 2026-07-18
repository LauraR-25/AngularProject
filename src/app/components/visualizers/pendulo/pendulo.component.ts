import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pendulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pendulo.component.html',
  styleUrl: './pendulo.component.css'
})
export class PenduloComponent {
  horaSimulada: Date = new Date();

  anguloIzquierdo = 0;
  anguloDerecho = 0;
  intensidadImpacto = 0;

  private readonly MAX_ANGULO = 35;
  private readonly DURACION_CICLO = 2;

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      this.calcularFisicas(date);
    }
  }

  private calcularFisicas(fecha: Date) {
    const t = fecha.getSeconds() + fecha.getMilliseconds() / 1000;
    const ciclo = t % this.DURACION_CICLO;

    // Potencia < 1 → la curva se aplana en los extremos (lento arriba)
    // y se empina en el centro (rápido abajo). Simula aceleración por gravedad.
    const CURVA_GRAVEDAD = 0.7;

    if (ciclo < 1) {
      const seno = Math.sin(ciclo * Math.PI);
      this.anguloIzquierdo = Math.pow(seno, CURVA_GRAVEDAD) * this.MAX_ANGULO;
      this.anguloDerecho = 0;
    } else {
      const seno = Math.sin((ciclo - 1) * Math.PI);
      this.anguloDerecho = -Math.pow(seno, CURVA_GRAVEDAD) * this.MAX_ANGULO;
      this.anguloIzquierdo = 0;
    }

    // Flash de impacto: pico agudo en los bordes del ciclo (0s, 1s, 2s...)
    // cos(t·π) alcanza máximo exacto en cada entero; exponente alto = flash breve
    const coseno = Math.cos(t * Math.PI);
    this.intensidadImpacto = Math.pow(Math.max(0, coseno), 14);
  }
}
