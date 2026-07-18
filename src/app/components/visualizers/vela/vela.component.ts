import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vela',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vela.component.html',
  styleUrl: './vela.component.css'
})
export class VelaComponent {
  // Altura inicial de la vela en píxeles (cuando está entera)
  alturaVelaPx: number = 250;

  // Escucha los cambios del flujo de tiempo en tiempo real
  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.calcularDerretimiento(date);
    }
  }

  private calcularDerretimiento(date: Date) {
    const horas = date.getHours();
    const minutos = date.getMinutes();
    const segundos = date.getSeconds();

    // Convertimos el tiempo transcurrido del día a minutos totales (0 a 1440 minutos en 24h)
    const minutosTotales = (horas * 60) + minutos + (segundos / 60);

    // Límites de diseño para la altura de la cera
    const alturaMaxima = 250; // Al inicio del día (00:00) la vela está nueva
    const alturaMinima = 45;  // Al final del día (23:59) queda un cabo de vela pequeño

    // Proporción del día que queda disponible (va de 1 a 0)
    const porcentajeRestante = (1440 - minutosTotales) / 1440;

    // Ajuste dinámico de la altura
    this.alturaVelaPx = alturaMinima + ((alturaMaxima - alturaMinima) * porcentajeRestante);
  }
}