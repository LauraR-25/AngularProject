import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Barra {
  ancho: number;
  altura: number;
  color: string;
}

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.css'
})
export class BarcodeComponent {
  horaSimulada: Date = new Date();
  barras: Barra[] = [];
  codigoDigital = '00:00:00';
  scanlineY = 0;

  private readonly COLORES = [
    '#00ffcc', '#00e5ff', '#ff0055', '#ffd60a',
    '#00ff66', '#ff6fa8', '#e07818', '#00e5ff'
  ];

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      this.generarBarras(date);
    }
  }

  private generarBarras(fecha: Date): void {
    const h = fecha.getHours().toString().padStart(2, '0');
    const m = fecha.getMinutes().toString().padStart(2, '0');
    const s = fecha.getSeconds().toString().padStart(2, '0');
    this.codigoDigital = `${h}:${m}:${s}`;

    const digitos = `${h}${m}${s}`;
    const barras: Barra[] = [];

    for (let i = 0; i < digitos.length; i++) {
      const d = parseInt(digitos[i], 10);
      barras.push({
        ancho: this.mapearAncho(d),
        altura: this.mapearAltura(d, i),
        color: this.COLORES[i % this.COLORES.length]
      });
    }

    barras.push({ ancho: 2, altura: 60, color: '#333' });
    barras.push({ ancho: 4, altura: 80, color: '#00ffcc' });

    barras.push({ ancho: this.mapearAncho(parseInt(s[1], 10)), altura: 40, color: '#ff0055' });

    barras.push({ ancho: 1, altura: 50, color: '#222' });
    barras.push({ ancho: 3, altura: 70, color: '#00e5ff' });

    for (let i = 0; i < digitos.length; i++) {
      const d = parseInt(digitos[i], 10);
      const paired = parseInt(digitos[(i + 3) % digitos.length], 10);
      barras.push({
        ancho: this.mapearAncho(d),
        altura: this.mapearAltura(paired, i + 6),
        color: this.COLORES[(i + 3) % this.COLORES.length]
      });
    }

    barras.push({ ancho: 1, altura: 35, color: '#1a1a2e' });
    barras.push({ ancho: 6, altura: 90, color: '#ffd60a' });
    barras.push({ ancho: 2, altura: 45, color: '#ff6fa8' });

    this.barras = barras;
  }

  private mapearAncho(digito: number): number {
    return 4 + digito * 3;
  }

  private mapearAltura(digito: number, indice: number): number {
    const base = 30 + digito * 7;
    const offset = (indice % 2 === 0) ? 10 : -5;
    return Math.max(20, Math.min(100, base + offset));
  }
}
