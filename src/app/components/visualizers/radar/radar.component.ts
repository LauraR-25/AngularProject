import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar.component.html',
  styleUrl: './radar.component.css'
})
export class RadarComponent {
  horaSimulada: Date = new Date();
  
  // Ángulos de rotación para cada elemento del radar
  anguloSegundos = 0;
  anguloMinutos = 0;
  anguloHoras = 0;

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      this.calcularPosicionesRadar(date);
    }
  }

  private calcularPosicionesRadar(fecha: Date) {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    const milisegundos = fecha.getMilliseconds();

    // 1. SEGUNDOS: 360 grados / 60 segundos = 6 grados por segundo (añadimos milisegundos para suavidad si avanza rápido)
    this.anguloSegundos = (segundos * 6) + (milisegundos * 0.006);

    // 2. MINUTOS: 360 grados / 60 minutos = 6 grados por minuto + una pizca según los segundos actuales
    this.anguloMinutos = (minutos * 6) + (segundos * 0.1);

    // 3. HORAS: Formato de 12 horas para el radar circular. 360 grados / 12 horas = 30 grados por hora
    const hora12 = horas % 12;
    this.anguloHoras = (hora12 * 30) + (minutos * 0.5);
  }
}