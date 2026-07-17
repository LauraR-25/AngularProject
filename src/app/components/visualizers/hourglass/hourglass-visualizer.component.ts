import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hourglass-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hourglass-visualizer.component.html',
  styleUrl: './hourglass-visualizer.component.css'
})
export class HourglassVisualizerComponent {
  displayTime: string = '00:00:00';
  topSandHeight: number = 100;
  bottomSandHeight: number = 0;

  isStreaming: boolean = true;
  isFlipping: boolean = false;
  flipRotation: number = 0;
  private lastHour: number = -1;

  @Input() set currentTime(date: Date | null) {
    if (!date) return;

    this.displayTime = date.toLocaleTimeString('es-ES', { hour12: false });

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Cambio de hora -> giro orgánico de 180deg (acumulado para evitar saltos)
    if (this.lastHour !== -1 && hours !== this.lastHour) {
      this.triggerFlip();
    }
    this.lastHour = hours;

    if (!this.isFlipping) {
      // Progreso matemático de la hora local: 3600s = 100% de la hora
      const elapsedInHour = minutes * 60 + seconds;
      const percentage = (elapsedInHour / 3600) * 100;

      // La arena cae de forma continua y proporcional al tiempo transcurrido.
      // Al iniciar la hora (00:00) la superior está llena (100) y la inferior vacía (0).
      // Al terminar la hora (59:59) la superior está vacía (0) y la inferior llena (100).
      this.topSandHeight = 100 - percentage;
      this.bottomSandHeight = percentage;
      this.isStreaming = percentage > 0 && percentage < 100;
    }
  }

  private triggerFlip() {
    this.isFlipping = true;
    this.isStreaming = false;

    // Esperar 300-500 ms antes de iniciar la rotación (la arena queda fija en el cristal)
    setTimeout(() => {
      this.flipRotation += 180;

      // La rotación dura 1.5s (ease-in-out en CSS). Al finalizar, la antigua
      // parte inferior (llena) pasa a ser la nueva superior y el flujo recomienza.
      setTimeout(() => {
        this.isFlipping = false;
        this.isStreaming = true;
      }, 1500);
    }, 400);
  }
}
