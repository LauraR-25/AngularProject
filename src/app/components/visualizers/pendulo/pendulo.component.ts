import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pendulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pendulo.component.html',
  styleUrl: './pendulo.component.css'
})
export class PenduloComponent {
  horaSimulada: Date = new Date();
  
  anguloIzquierdo = 0;
  anguloDerecho = 0;
  intensidadImpacto = 0;

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      this.calcularFisicas(date);
    }
  }

  private calcularFisicas(fecha: Date) {
    const segundos = fecha.getSeconds();
    const milisegundos = fecha.getMilliseconds();
    
    // Convertimos el tiempo a una línea continua con decimales
    const t = segundos + (milisegundos / 1000);
    
    // Un ciclo completo del péndulo dura 2 segundos (1s izq, 1s der)
    const ciclo = t % 2; 

    // Calculamos el arco de la oscilación usando la función matemática Seno
    if (ciclo < 1) {
      // Movimiento de la esfera izquierda (del segundo 0 al 1)
      this.anguloIzquierdo = Math.sin(ciclo * Math.PI) * 35; // 35 grados de inclinación máx.
      this.anguloDerecho = 0;
    } else {
      // Movimiento de la esfera derecha (del segundo 1 al 2)
      this.anguloIzquierdo = 0;
      this.anguloDerecho = -Math.sin((ciclo - 1) * Math.PI) * 35;
    }

    // Calculamos el destello de energía en el centro justo en el momento del choque.
    // El choque ocurre exactamente en los segundos enteros (0.0, 1.0, 2.0...).
    // Usamos Coseno elevado a una potencia alta para crear un pico brusco de luz.
    this.intensidadImpacto = Math.pow(Math.max(0, Math.cos(t * Math.PI)), 12);
  }
}