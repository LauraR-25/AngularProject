import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apple-watch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apple-watch.component.html',
  styleUrl: './apple-watch.component.css'
})
export class AppleWatchComponent implements OnInit, OnDestroy {
  // Variables de visualización
  displayTime: string = '00:00:00';
  timeOfDay: 'morning' | 'afternoon' | 'night' = 'morning';
  temperature: string = '30°C';

  private animationFrameId: number | null = null;

  // Input con tipado seguro para manejar posibles valores nulos
  @Input() set currentTime(date: Date | null | undefined) {
    const validDate = date || new Date();
    this.updateWatchState(validDate);
  }

  ngOnInit() {
    this.startClockLoop();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startClockLoop() {
    const loop = () => {
      this.updateWatchState(new Date());
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private updateWatchState(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formateo de hora estilo Apple (HH:MM:SS)
    this.displayTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Lógica condicional para los estados del día
    if (hours >= 6 && hours < 12) {
      // Mañana (6:00 AM - 11:59 AM)
      this.timeOfDay = 'morning';
      this.temperature = '30°C';
    } else if (hours >= 12 && hours < 19) {
      // Tarde (12:00 PM - 6:59 PM)
      this.timeOfDay = 'afternoon';
      this.temperature = '20°C';
    } else {
      // Noche (7:00 PM - 5:59 AM)
      this.timeOfDay = 'night';
      this.temperature = '10°C';
    }
  }
}