import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mechanical-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mechanical-clock.component.html',
  styleUrl: './mechanical-clock.component.css'
})
export class MechanicalClockComponent {
  // Estilos en línea dinámicos para la rotación de las agujas (en grados)
  hourHandStyle: string = 'rotate(0deg)';
  minuteHandStyle: string = 'rotate(0deg)';
  secondHandStyle: string = 'rotate(0deg)';

  // Recibe el flujo de tiempo directo desde el slider del simulador general
  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.updateClockHands(date);
    }
  }

  private updateClockHands(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Cálculo matemático preciso para el movimiento continuo de los relojes de agujas
    const secondsDegrees = (seconds / 60) * 360;
    const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    const hoursDegrees = ((hours % 12 / 12) * 360) + ((minutes / 60) * 30);

    // Asignación de strings de transformación para CSS
    this.hourHandStyle = `rotate(${hoursDegrees}deg)`;
    this.minuteHandStyle = `rotate(${minutesDegrees}deg)`;
    this.secondHandStyle = `rotate(${secondsDegrees}deg)`;
  }
}