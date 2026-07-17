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

    // Detectar cambio de hora para disparar la animación de giro
    if (this.lastHour !== -1 && hours !== this.lastHour) {
      this.triggerFlip();
    }
    this.lastHour = hours;

    // Lógica del flujo de arena (si no está girando)
    if (!this.isFlipping) {
      const totalSeconds = (minutes * 60) + seconds;
      const percentage = (totalSeconds / 60) * 100; // 60 segundos = 100% del minuto
      
      this.topSandHeight = 100 - percentage;
      this.bottomSandHeight = percentage;
      this.isStreaming = percentage > 0 && percentage < 100;
    }
  }

  private triggerFlip() {
    this.isFlipping = true;
    this.isStreaming = false;
    
    // Acumulamos 180deg para evitar saltos visuales en giros consecutivos
    this.flipRotation += 180;

    // Esperamos 1.5s (lo que dura la animación CSS) antes de resetear los valores
    setTimeout(() => {
      this.isFlipping = false;
      this.topSandHeight = 100;
      this.bottomSandHeight = 0;
      this.isStreaming = true;
    }, 1500);
  }
}