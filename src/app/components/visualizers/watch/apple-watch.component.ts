import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apple-watch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apple-watch.component.html',
  styleUrl: './apple-watch.component.css'
})
export class AppleWatchComponent {
  displayTime: string = '00:00:00';
  isNight: boolean = false;

  // Porcentajes de llenado de las3 barras de actividad (0–100)
  barActivity: number = 0;
  barExercise: number = 0;
  barStand: number = 0;

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.updateWatchState(date);
    }
  }

  private updateWatchState(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    this.displayTime =
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Día: 6:00–18:59, Noche: 19:00–5:59
    this.isNight = hours >= 19 || hours < 6;

    // Minuto total del día (0–1439)
    const minutoDia = hours * 60 + minutes;

    // Barra de Actividad (roja) — crece con las horas despierto, pico12h–20h
    this.barActivity = this.calcularBarra(minutoDia, 6, 20, 95);

    // Barra de Ejercicio (verde) — picos mañana7–9h y tarde17–19h
    this.barExercise = this.calcularBarraDual(minutoDia, 7, 9, 17, 19, 80);

    // Barra de Pie (azul) — se llena gradualmente durante el día
    this.barStand = this.calcularBarra(minutoDia, 6, 22, 85);
  }

  /**
   * Barra simple: crece linealmente desde `inicio` hasta `fin` (minutos del día),
   * alcanzando `maxFill`% en su pico.
   */
  private calcularBarra(minutoDia: number, inicio: number, fin: number, maxFill: number): number {
    const totalMinutos = (fin - inicio) * 60;
    if (minutoDia < inicio * 60) return 0;
    if (minutoDia > fin * 60) return maxFill * 0.7;
    return Math.round(((minutoDia - inicio * 60) / totalMinutos) * maxFill);
  }

  /**
   * Barra con dos picos: crece durante dos ventanas horarias.
   */
  private calcularBarraDual(
    minutoDia: number,
    ini1: number, fin1: number,
    ini2: number, fin2: number,
    maxFill: number
  ): number {
    const ventana1 = this.calcularBarra(minutoDia, ini1, fin1, maxFill);
    const ventana2 = this.calcularBarra(minutoDia, ini2, fin2, maxFill);
    return Math.max(ventana1, ventana2);
  }
}
