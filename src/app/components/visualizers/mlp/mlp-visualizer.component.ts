import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkyPhase = 'dia' | 'atardecer' | 'noche';

@Component({
  selector: 'app-mlp-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mlp-visualizer.component.html',
  styleUrls: ['./mlp-visualizer.component.css']
})
export class MlpVisualizerComponent {
  phase: SkyPhase = 'dia';
  skyGradient: string = '';
  currentTime: Date = new Date();

  // Sol: posición vertical en lateral izquierdo
  sunY = 5;
  sunVisible = true;

  // Luna: posición vertical en lateral izquierdo
  moonY = 5;
  moonVisible = false;

  // Estrellas fijas (puntos diminutos, concentrados en lateral izquierdo)
  estrellas: { cx: number; cy: number; r: number; opacidad: number }[] = [];
  showStars = false;

  // Princesas
  showCelestia = true;
  showLuna = false;

  readonly phaseLabels: Record<SkyPhase, string> = {
    dia: '☀ Día',
    atardecer: '🌅 Atardecer',
    noche: '🌙 Noche'
  };

  get phaseLabel(): string {
    return this.phaseLabels[this.phase];
  }

  @Input() set currentTimeInput(date: Date | null | undefined) {
    if (date) {
      this.currentTime = date;
      this.calcularEstado(date);
    }
  }

  private calcularEstado(date: Date): void {
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const totalMin = h * 60 + m;
    const totalSec = h * 3600 + m * 60 + s;

    // ─── Fase del cielo ───
    // Día: 6:00–18:00, Atardecer: 18:00–19:00, Noche: 19:00–6:00
    if (totalMin >= 360 && totalMin < 1080) {
      this.phase = 'dia';
    } else if (totalMin >= 1080 && totalMin < 1140) {
      this.phase = 'atardecer';
    } else {
      this.phase = 'noche';
    }

    // Gradiente del cielo
    this.skyGradient = this.buildSkyGradient(totalSec);

    // ─── SOL: descenso vertical en lateral izquierdo (6h → 18h) ───
    if (h >= 6 && h < 18) {
      const segundosEnCiclo = (h - 6) * 3600 + m * 60 + s;
      const duracionCiclo = 12 * 3600; // 12 horas
      const progreso = segundosEnCiclo / duracionCiclo; // 0 → 1
      this.sunY = 5 + progreso * 90; // 5% → 95%
      this.sunVisible = true;
    } else {
      this.sunVisible = false;
    }

    // ─── LUNA: descenso vertical en lateral izquierdo (19h → 5h) ───
    if (h >= 19 || h < 5) {
      let segundosEnCiclo: number;
      if (h >= 19) {
        segundosEnCiclo = (h - 19) * 3600 + m * 60 + s;
      } else {
        segundosEnCiclo = (h + 5) * 3600 + m * 60 + s;
      }
      const duracionCiclo = 10 * 3600; // 10 horas
      const progreso = Math.min(1, segundosEnCiclo / duracionCiclo);
      this.moonY = 5 + progreso * 90; // 5% → 95%
      this.moonVisible = true;
    } else {
      this.moonVisible = false;
    }

    // ─── Estrellas fijas (concentradas en cuadrante izquierdo, solo de noche) ───
    this.showStars = this.phase === 'noche';
    if (this.estrellas.length === 0) {
      for (let i = 0; i < 50; i++) {
        this.estrellas.push({
          cx: this.pseudoRandom(i * 7 + 1) * 45,
          cy: this.pseudoRandom(i * 13 + 3) * 85,
          r: 0.3 + this.pseudoRandom(i * 19 + 7) * 0.7,
          opacidad: 0.4 + this.pseudoRandom(i * 23 + 11) * 0.6
        });
      }
    }

    // ─── Princesas ───
    this.showCelestia = this.phase !== 'noche';
    this.showLuna = this.phase === 'noche';
  }

  private buildSkyGradient(secs: number): string {
    if (secs < 21600) {
      const t = secs / 21600;
      return `linear-gradient(to bottom, #000010 0%, #050a1a ${30 + t * 20}%, #0b1a35 100%)`;
    } else if (secs < 25200) {
      return `linear-gradient(to bottom, #1a0a2e 0%, #8b2252 30%, #e8621a 65%, #f9a743 100%)`;
    } else if (secs < 43200) {
      const t = (secs - 25200) / 18000;
      return `linear-gradient(to bottom, #1c6ab0 0%, #3a9bd5 ${40 + t * 20}%, #87ceeb 100%)`;
    } else if (secs < 57600) {
      return `linear-gradient(to bottom, #0a4a8c 0%, #1a6bb8 40%, #5aace0 100%)`;
    } else if (secs < 68400) {
      return `linear-gradient(to bottom, #0d1b4b 0%, #7b2d5c 25%, #e85d1a 55%, #f4a800 100%)`;
    } else {
      const t = (secs - 68400) / 17800;
      return `linear-gradient(to bottom, #000005 0%, #03051a ${20 + t * 15}%, #060e24 100%)`;
    }
  }

  private pseudoRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
