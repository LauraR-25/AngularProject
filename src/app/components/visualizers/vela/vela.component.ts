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
  porcentajeConsumo: number = 0;
  alturaVelaPx: number = 250;

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.calcularEstadoVela(date);
    }
  }

  // Altura máxima de diseño (vela nueva)
  private readonly ALTURA_MAX = 250;

  get llamaEncendida(): boolean {
    return this.porcentajeConsumo < 100;
  }

  get llamaScale(): number {
    // Proporcional al tamaño de la cera: 1.0 cuando nueva, ~0.18 cuando consumida
    return this.alturaVelaPx / this.ALTURA_MAX;
  }

  get llamaOpacidad(): number {
    // Mism proporción que la cera restante
    return this.alturaVelaPx / this.ALTURA_MAX;
  }

  get resplandorScale(): number {
    // Proporcional pero con un mínimo más generoso para que no desaparezca tan rápido
    const proporcion = this.alturaVelaPx / this.ALTURA_MAX;
    return Math.max(0.15, proporcion);
  }

  get resplandorOpacidad(): number {
    const proporcion = this.alturaVelaPx / this.ALTURA_MAX;
    return Math.max(0, proporcion - 0.05);
  }

  get pabiloAltura(): number {
    // 14px cuando nueva, 5px cuando casi consumida
    return 14 - (this.porcentajeConsumo / 100) * 9;
  }

  get gotaIzqAltura(): number {
    return 38 + (this.porcentajeConsumo / 100) * 14;
  }

  get gotaDerAltura(): number {
    return 24 + (this.porcentajeConsumo / 100) * 10;
  }

  private calcularEstadoVela(date: Date) {
    const minutosTotales = (date.getHours() * 60) + date.getMinutes() + (date.getSeconds() / 60);
    const duracionCiclo = 1440;

    // 0% al inicio del día (vela nueva), 100% al final (consumida)
    this.porcentajeConsumo = (minutosTotales / duracionCiclo) * 100;
    this.porcentajeConsumo = Math.min(100, Math.max(0, this.porcentajeConsumo));

    const alturaMaxima = 250;
    const alturaMinima = 45;
    const porcentajeRestante = 1 - this.porcentajeConsumo / 100;
    this.alturaVelaPx = alturaMinima + (alturaMaxima - alturaMinima) * porcentajeRestante;
  }
}
