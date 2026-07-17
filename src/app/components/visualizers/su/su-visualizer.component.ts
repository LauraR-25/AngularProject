import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-su-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './su-visualizer.component.html',
  styleUrl: './su-visualizer.component.css'
})
export class SuVisualizerComponent {
  
  // Rutas relativas a la carpeta de assets del proyecto
  private readonly IMG_BASE = 'assets/images/su/';

  // Imagen por defecto al cargar apuntando al PNG
  currentBackground: string = this.IMG_BASE + 'nevera_steven_dia.png';
  displayTime: string = '06:00:00';

  // Este Input recibe la fecha/hora simulada desde el componente padre
  @Input() set currentTime(date: Date | null) {
    if (!date) return;
    
    // Formatear la hora para mostrarla en pantalla (ej: 18:30:00)
    this.displayTime = date.toLocaleTimeString('es-ES', { hour12: false });
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeInMinutes = (hours * 60) + minutes;

    // LÓGICA DE HORARIOS:
    // Día: 06:00 (360 min) hasta 17:29 (1049 min)
    // Tarde: 17:30 (1050 min) hasta 19:29 (1169 min)
    // Noche: 19:30 (1170 min) hasta 05:59 (359 min)

    if (timeInMinutes >= 360 && timeInMinutes < 1050) {
      this.currentBackground = this.IMG_BASE + 'nevera_steven_dia.png';
    } else if (timeInMinutes >= 1050 && timeInMinutes < 1170) {
      this.currentBackground = this.IMG_BASE + 'nevera_steven_tarde.png';
    } else {
      this.currentBackground = this.IMG_BASE + 'nevera_steven_noche.png';
    }
  }
}