import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkyPhase = 'dia' | 'atardecer' | 'noche';

interface NubeData {
  cx: number;
  cy: number;
  scale: number;
  opacity: number;
}

interface EstrellaFugaz {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duracion: number;
  retraso: number;
}

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

  // Posiciones orbitales (porcentaje 0-100)
  sunX = 50;
  sunY = 50;
  sunVisible = true;
  moonX = 50;
  moonY = 50;
  moonVisible = false;

  // Nubes
  nubes: NubeData[] = [];
  cloudColor = '#ffffff';
  cloudOpacity = 1;

  // Estrellas
  estrellas: { cx: number; cy: number; r: number; opacidad: number }[] = [];
  estrellasFugaces: EstrellaFugaz[] = [];
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

    // Fase del cielo
    if (totalMin >= 360 && totalMin < 1080) {
      this.phase = 'dia';
    } else if (totalMin >= 1080 && totalMin <= 1190) {
      this.phase = 'atardecer';
    } else {
      this.phase = 'noche';
    }

    // Gradiente del cielo (reutiliza la lógica del TimeSimulatorService)
    this.skyGradient = this.buildSkyGradient(totalSec);

    // ─── Posición del SOL (arco diurno 6h–18h) ───
    if (h >= 5 && h < 19) {
      const progreso = ((h - 5) * 3600 + m * 60 + s) / (14 * 3600);
      this.sunX = 5 + progreso * 90;
      this.sunY = 5 + Math.sin(progreso * Math.PI) * 55;
      this.sunVisible = true;
    } else {
      this.sunVisible = false;
    }

    // ─── Posición de la LUNA (arco nocturno 19h–5h) ───
    if (h >= 18 || h < 6) {
      let progreso: number;
      if (h >= 18) {
        progreso = ((h - 18) * 3600 + m * 60 + s) / (12 * 3600);
      } else {
        progreso = ((h + 6) * 3600 + m * 60 + s) / (12 * 3600);
      }
      progreso = Math.min(1, Math.max(0, progreso));
      this.moonX = 5 + progreso * 90;
      this.moonY = 5 + Math.sin(progreso * Math.PI) * 50;
      this.moonVisible = true;
    } else {
      this.moonVisible = false;
    }

    // ─── Nubes ───
    this.cloudOpacity = this.phase === 'noche' ? 0.15 : 1;
    if (this.phase === 'dia') {
      this.cloudColor = '#ffffff';
    } else if (this.phase === 'atardecer') {
      this.cloudColor = '#ffb88c';
    } else {
      this.cloudColor = '#3a4466';
    }

    if (this.nubes.length === 0) {
      this.nubes = [
        { cx: 15, cy: 22, scale: 1, opacity: 0.9 },
        { cx: 40, cy: 15, scale: 1.2, opacity: 0.85 },
        { cx: 65, cy: 28, scale: 0.9, opacity: 0.75 },
        { cx: 85, cy: 18, scale: 1.1, opacity: 0.8 },
        { cx: 28, cy: 35, scale: 0.8, opacity: 0.7 },
      ];
    }

    // ─── Estrellas (solo de noche) ───
    this.showStars = this.phase === 'noche';
    if (this.estrellas.length === 0) {
      for (let i = 0; i < 40; i++) {
        this.estrellas.push({
          cx: this.pseudoRandom(i * 7 + 1) * 100,
          cy: this.pseudoRandom(i * 13 + 3) * 60,
          r: 0.5 + this.pseudoRandom(i * 19 + 7) * 1.5,
          opacidad: 0.3 + this.pseudoRandom(i * 23 + 11) * 0.7
        });
      }
    }

    // ─── Estrellas fugaces ───
    this.estrellasFugaces = [
      { x1: 10, y1: 8, x2: 35, y2: 25, duracion: 0.8, retraso: 0 },
      { x1: 55, y1: 5, x2: 80, y2: 20, duracion: 0.6, retraso: 4 },
      { x1: 30, y1: 12, x2: 50, y2: 30, duracion: 0.7, retraso: 8 },
    ];

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
