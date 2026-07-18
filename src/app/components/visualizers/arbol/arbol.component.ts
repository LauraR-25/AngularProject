import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { obtenerInfoFechaYEstacion, InfoFecha } from '../../../services/date-station.utils';

@Component({
  selector: 'app-arbol',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arbol.component.html',
  styleUrl: './arbol.component.css'
})
export class ArbolComponent {
  fechaLocal: Date = new Date();
  infoSimulada?: InfoFecha;

  @Input() set currentTime(date: Date | null | undefined) {
    // 1. Mantiene el reloj de la hora local (sistema) activo en tiempo real
    this.fechaLocal = new Date();

    // 2. Calcula la fecha y la estación de la barra del simulador
    if (date) {
      this.infoSimulada = obtenerInfoFechaYEstacion(date);
    }
  }
}