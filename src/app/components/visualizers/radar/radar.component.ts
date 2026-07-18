import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-radar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar.component.html',
  styleUrl: './radar.component.css'
})
export class RadarComponent {
  private timeService = inject(TimeService);

  horaSimulada: Date = new Date();

  anguloSegundos = 0;
  anguloMinutos = 0;
  anguloHoras = 0;

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      this.calcularPosicionesRadar(date);
    }
  }

  get speed(): number {
    return this.timeService.speed;
  }

  get paused(): boolean {
    return this.timeService.paused;
  }

  private calcularPosicionesRadar(fecha: Date): void {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    const milisegundos = fecha.getMilliseconds();

    this.anguloSegundos = (segundos * 6) + (milisegundos * 0.006);

    this.anguloMinutos = (minutos * 6) + (segundos * 0.1);

    const hora12 = horas % 12;
    this.anguloHoras = (hora12 * 30) + (minutos * 0.5);
  }
}
