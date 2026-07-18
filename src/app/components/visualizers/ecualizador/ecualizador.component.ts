import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecualizador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecualizador.component.html',
  styleUrl: './ecualizador.component.css'
})
export class EcualizadorComponent {
  // Arreglo inicial de 15 barras
  barras = Array.from({ length: 15 }, () => ({ alturaPx: 20, color: '#00ffcc', sombra: 'none' }));

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.procesarOndas(date);
    }
  }

  private procesarOndas(fecha: Date) {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    // 1. INTENSIDAD (ALTURA): 
    // A las 12 del mediodía es el volumen máximo (12). A la medianoche es el mínimo (0).
    const picoHora = horas <= 12 ? horas : 24 - horas; 
    const alturaBase = 30 + (picoHora * 16); // Va desde 30px (noche) hasta ~222px (mediodía)

    // 2. TONALIDAD: 
    // Día (6am - 6pm): Tonos cálidos (Rojos a Amarillos)
    // Noche (6pm - 6am): Tonos fríos (Azules a Morados)
    let hue;
    if (horas >= 6 && horas < 18) {
      hue = 10 + (minutos * 1.2); 
    } else {
      hue = 220 + (minutos * 1.2); 
    }
    const colorActual = `hsl(${hue}, 100%, 55%)`;
    const resplandor = `0 0 15px hsl(${hue}, 100%, 55%), 0 0 30px hsl(${hue}, 100%, 35%)`;

    // 3. OSCILACIÓN (Movimiento con Seno):
    this.barras = this.barras.map((barra, index) => {
      // Los minutos alteran la frecuencia de la onda, los segundos la hacen avanzar
      const frecuencia = 0.5 + (minutos / 60); 
      const desfase = index * 0.45; // Separación entre cada barra
      
      // La función seno devuelve valores entre -1 y 1
      const variacion = Math.sin((segundos * frecuencia) + desfase);
      
      // Calculamos la altura final dándole un pequeño factor aleatorio para simular "ruido" de audio
      const ruido = Math.random() * 15;
      const alturaFinal = Math.max(10, alturaBase + (variacion * (alturaBase * 0.4)) + ruido);

      return {
        alturaPx: alturaFinal,
        color: colorActual,
        sombra: resplandor
      };
    });
  }
}