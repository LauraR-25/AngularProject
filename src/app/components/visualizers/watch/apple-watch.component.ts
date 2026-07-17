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

  // Sincronización directa con el simulador principal (reacciona al mover el slider de desfase)
  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.updateWatchState(date);
    }
  }

  private updateWatchState(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatear la hora en formato HH:MM:SS reflejando el tiempo del simulador
    this.displayTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Lógica para alternar el emoji: Noche de 7:00 PM (19h) a 5:59 AM, Día de 6:00 AM a 6:59 PM (18h)
    this.isNight = (hours >= 19 || hours < 6);
  }
}