import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-melting-candle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './melting-candle.component.html',
  styleUrl: './melting-candle.component.css'
})
export class MeltingCandleComponent {
  // Altura inicial de la vela en pixeles
  candleHeightPx: number = 250;

  // Se actualiza en tiempo real al mover el slider de desfase horario
  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.updateCandleMelting(date);
    }
  }

  private updateCandleMelting(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Convertir la hora del día a minutos totales (0 a 1440 minutos posibles en 24h)
    const totalMinutes = (hours * 60) + minutes + (seconds / 60);

    // Medidas de la vela
    const maxHeight = 250; // Vela nueva a las 00:00
    const minHeight = 40;  // Vela derretida a las 23:59

    // Calculamos qué porcentaje del día queda para asignarlo a la altura
    const percentageLeft = (1440 - totalMinutes) / 1440;

    // Calculamos la altura final fluida
    this.candleHeightPx = minHeight + ((maxHeight - minHeight) * percentageLeft);
  }
}