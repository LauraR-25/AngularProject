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
  displayDate: string = '01/01';
  isNight: boolean = false;
  isPlaying: boolean = true;
  progress: number = 0;

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

    // Fecha DD/MM/YY
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear().toString().slice(-2);
    this.displayDate = `${dia}/${mes}/${anio}`;

    // Día: 6:00–18:59, Noche: 19:00–5:59
    this.isNight = hours >= 19 || hours < 6;

    // Barra de progreso: ciclo de 60 segundos
    this.progress = (seconds / 60) * 100;

    // Barras de actividad
    const minutoDia = hours * 60 + minutes;
    this.barActivity = this.calcularBarra(minutoDia, 6, 20, 95);
    this.barExercise = this.calcularBarraDual(minutoDia, 7, 9, 17, 19, 80);
    this.barStand = this.calcularBarra(minutoDia, 6, 22, 85);
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
  }

  private calcularBarra(minutoDia: number, inicio: number, fin: number, maxFill: number): number {
    const totalMinutos = (fin - inicio) * 60;
    if (minutoDia < inicio * 60) return 0;
    if (minutoDia > fin * 60) return maxFill * 0.7;
    return Math.round(((minutoDia - inicio * 60) / totalMinutos) * maxFill);
  }

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
