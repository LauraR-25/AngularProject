import { Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { obtenerInfoFechaYEstacion, InfoFecha } from '../../../services/date-station.utils';
import { TimeService } from '../../../services/time.service';

interface Circulo {
  cx: number;
  cy: number;
  r: number;
  color: string;
}

interface HojaSuelo {
  x: number;
  y: number;
  rotacion: number;
  color: string;
}

interface Flor {
  cx: number;
  cy: number;
  petalos: string[];
  centro: string;
}

interface Nieve {
  cx: number;
  cy: number;
  r: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  opacity: number;
  type: 'leaf' | 'petal' | 'snow';
  swayPhase: number;
}

interface SeasonParticleConfig {
  colors: string[];
  sizeRange: [number, number];
  type: 'leaf' | 'petal' | 'snow' | 'mixed';
  spawnAreaX: [number, number];
  spawnAreaY: [number, number];
  gravity: number;
  baseFallSpeed: number;
  spawnIntervalMs: number;
}

const SEASON_PARTICLE_CONFIG: Record<string, SeasonParticleConfig> = {
  primavera: {
    colors: ['#228b22', '#2e9e28', '#43b840', '#5ec95a', '#ff80ab', '#ff6fa8', '#ffd6e8', '#ff90bb'],
    sizeRange: [2.5, 5.5],
    type: 'mixed',
    spawnAreaX: [130, 270],
    spawnAreaY: [25, 105],
    gravity: 0.018,
    baseFallSpeed: 0.35,
    spawnIntervalMs: 700,
  },
  verano: {
    colors: ['#1a7a14', '#228b22', '#2e9e28', '#36a032', '#43b840', '#5ec95a'],
    sizeRange: [2.5, 5],
    type: 'leaf',
    spawnAreaX: [130, 270],
    spawnAreaY: [25, 105],
    gravity: 0.016,
    baseFallSpeed: 0.3,
    spawnIntervalMs: 900,
  },
  otono: {
    colors: ['#8b3a00', '#a84400', '#cc5500', '#d94f00', '#e07818', '#c46200', '#b85c00'],
    sizeRange: [2.5, 6],
    type: 'leaf',
    spawnAreaX: [120, 280],
    spawnAreaY: [20, 110],
    gravity: 0.022,
    baseFallSpeed: 0.25,
    spawnIntervalMs: 600,
  },
  invierno: {
    colors: ['#ffffff', '#e8eef5', '#d0d8e8', '#f0f4fa', '#c8d4e8'],
    sizeRange: [1.5, 3.5],
    type: 'snow',
    spawnAreaX: [60, 340],
    spawnAreaY: [-10, 15],
    gravity: 0.008,
    baseFallSpeed: 0.2,
    spawnIntervalMs: 350,
  },
};

@Component({
  selector: 'app-arbol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arbol.component.html',
  styleUrl: './arbol.component.css'
})
export class ArbolComponent implements OnDestroy {
  private timeService = inject(TimeService);

  infoSimulada?: InfoFecha;
  horaSimulada: Date = new Date();

  manualMode = false;
  manualDate: Date = new Date();

  hojas: Circulo[] = [];
  hojasSuelo: HojaSuelo[] = [];
  flores: Flor[] = [];
  nieveRamas: Nieve[] = [];
  nieveSuelo: Nieve[] = [];

  // ── Particle system ──
  particles: Particle[] = [];
  private particleId = 0;
  private animFrameId = 0;
  private lastFrameTime = 0;
  private spawnAccum = 0;
  private currentSeason: string = 'verano';
  private readonly MAX_PARTICLES = 55;
  private readonly GROUND_Y = 308;

  private get effectiveDate(): Date {
    return this.manualMode ? this.manualDate : this.horaSimulada;
  }

  private recalc(): void {
    this.infoSimulada = obtenerInfoFechaYEstacion(this.effectiveDate);
    this.currentSeason = this.infoSimulada?.estacion || 'verano';
    this.generarElementos();
    this.particles = [];
    this.spawnAccum = 0;
  }

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      if (!this.manualMode) {
        this.recalc();
      }
    }
  }

  constructor() {
    this.startAnimation();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }

  // ═══════════════════════════════════════════
  //  PARTICLE SYSTEM — requestAnimationFrame
  // ═══════════════════════════════════════════

  private startAnimation(): void {
    this.lastFrameTime = performance.now();
    this.animFrameId = requestAnimationFrame((t) => this.animate(t));
  }

  private animate(timestamp: number): void {
    const realDelta = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    if (!this.timeService.paused && realDelta < 200) {
      const effectiveDelta = realDelta * this.timeService.speed;
      this.updateParticles(effectiveDelta);
      this.spawnTick(effectiveDelta);
    }

    this.animFrameId = requestAnimationFrame((t) => this.animate(t));
  }

  private spawnTick(deltaMs: number): void {
    if (this.particles.length >= this.MAX_PARTICLES) return;

    const cfg = SEASON_PARTICLE_CONFIG[this.currentSeason];
    if (!cfg) return;

    this.spawnAccum += deltaMs;

    while (this.spawnAccum >= cfg.spawnIntervalMs && this.particles.length < this.MAX_PARTICLES) {
      this.spawnAccum -= cfg.spawnIntervalMs;
      this.spawnParticle(cfg);
    }
  }

  private spawnParticle(cfg: SeasonParticleConfig): void {
    const isSpringMixed = cfg.type === 'mixed';
    let type: 'leaf' | 'petal' | 'snow' = cfg.type as any;
    if (isSpringMixed) {
      type = Math.random() > 0.45 ? 'leaf' : 'petal';
    }

    const p: Particle = {
      id: this.particleId++,
      x: cfg.spawnAreaX[0] + Math.random() * (cfg.spawnAreaX[1] - cfg.spawnAreaX[0]),
      y: cfg.spawnAreaY[0] + Math.random() * (cfg.spawnAreaY[1] - cfg.spawnAreaY[0]),
      vx: (Math.random() - 0.5) * 0.4,
      vy: cfg.baseFallSpeed + Math.random() * 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      size: cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]),
      opacity: 0.65 + Math.random() * 0.35,
      type,
      swayPhase: Math.random() * Math.PI * 2,
    };

    this.particles.push(p);
  }

  private updateParticles(deltaMs: number): void {
    const dt = deltaMs / 16.667;
    const cfg = SEASON_PARTICLE_CONFIG[this.currentSeason];
    if (!cfg) return;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vy += cfg.gravity * dt;

      const swayAmp = p.type === 'snow' ? 0.012 : 0.006;
      p.vx += Math.sin(p.swayPhase + p.y * 0.03) * swayAmp * dt;
      p.vx *= 0.998;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotationSpeed * dt;

      if (p.y > this.GROUND_Y) {
        this.particles.splice(i, 1);
      }
    }
  }

  // ═══════════════════════════════════════════
  //  STATIC ELEMENT GENERATION (unchanged)
  // ═══════════════════════════════════════════

  private generarElementos(): void {
    const estacion = this.infoSimulada?.estacion || 'verano';
    const mes = this.effectiveDate.getMonth();

    switch (estacion) {
      case 'verano':
        this.generarHojasVerano(mes);
        this.hojasSuelo = [];
        this.flores = [];
        this.nieveRamas = [];
        this.nieveSuelo = [];
        break;
      case 'primavera':
        this.generarHojasPrimavera(mes);
        this.generarFloresPrimavera();
        this.hojasSuelo = [];
        this.nieveRamas = [];
        this.nieveSuelo = [];
        break;
      case 'otono':
        this.generarHojasOtono(mes);
        this.generarHojasSuelo();
        this.flores = [];
        this.nieveRamas = [];
        this.nieveSuelo = [];
        break;
      case 'invierno':
        this.hojas = [];
        this.hojasSuelo = [];
        this.flores = [];
        this.generarNieve();
        break;
    }
  }

  private generarHojasVerano(_mes: number): void {
    const colores = ['#1a7a14', '#228b22', '#2e9e28', '#36a032', '#43b840', '#5ec95a'];
    this.hojas = this.crearCopas(colores, 20);
  }

  private generarHojasPrimavera(_mes: number): void {
    const colores = ['#228b22', '#2e9e28', '#43b840', '#5ec95a', '#6fd66b'];
    this.hojas = this.crearCopas(colores, 18);
  }

  private generarHojasOtono(_mes: number): void {
    const colores = ['#8b3a00', '#a84400', '#cc5500', '#d94f00', '#e07818', '#c46200'];
    this.hojas = this.crearCopas(colores, 16);
  }

  private crearCopas(colores: string[], cantidad: number): Circulo[] {
    const resultado: Circulo[] = [];
    const semilla = 42;
    for (let i = 0; i < cantidad; i++) {
      const f1 = this.seudoaleatorio(semilla + i * 7);
      const f2 = this.seudoaleatorio(semilla + i * 13 + 3);
      const f3 = this.seudoaleatorio(semilla + i * 19 + 7);
      resultado.push({
        cx: 140 + f1 * 120,
        cy: 30 + f2 * 90,
        r: 22 + f3 * 22,
        color: colores[i % colores.length]
      });
    }
    return resultado;
  }

  private generarFloresPrimavera(): void {
    const coloresPetalo = ['#ff80ab', '#ff6fa8', '#ffd6e8', '#ff90bb'];
    const centros = ['#ffcc00', '#ffaa00', '#ff8800'];
    this.flores = [];

    const posicionesCopa = [
      { cx: 155, cy: 50 }, { cx: 200, cy: 35 }, { cx: 245, cy: 60 },
      { cx: 175, cy: 80 }, { cx: 220, cy: 75 }, { cx: 190, cy: 45 },
      { cx: 165, cy: 65 }, { cx: 235, cy: 50 }
    ];
    posicionesCopa.forEach((pos, i) => {
      this.flores.push({
        cx: pos.cx, cy: pos.cy,
        petalos: [coloresPetalo[i % coloresPetalo.length]],
        centro: centros[i % centros.length]
      });
    });

    const posicionesSuelo = [
      { cx: 120, cy: 305 }, { cx: 170, cy: 310 }, { cx: 230, cy: 308 },
      { cx: 260, cy: 312 }, { cx: 145, cy: 315 }
    ];
    posicionesSuelo.forEach((pos, i) => {
      this.flores.push({
        cx: pos.cx, cy: pos.cy,
        petalos: [coloresPetalo[(i + 2) % coloresPetalo.length]],
        centro: centros[(i + 1) % centros.length]
      });
    });
  }

  private generarHojasSuelo(): void {
    const colores = ['#8b3a00', '#a84400', '#cc5500', '#d94f00', '#e07818'];
    this.hojasSuelo = [];
    const posiciones = [
      { x: 115, y: 310, rot: 18 }, { x: 145, y: 315, rot: -12 },
      { x: 185, y: 312, rot: 40 }, { x: 225, y: 308, rot: -25 },
      { x: 255, y: 313, rot: 55 }, { x: 165, y: 318, rot: -40 },
      { x: 195, y: 306, rot: 30 }, { x: 275, y: 310, rot: -15 }
    ];
    posiciones.forEach((pos, i) => {
      this.hojasSuelo.push({ x: pos.x, y: pos.y, rotacion: pos.rot, color: colores[i % colores.length] });
    });
  }

  private generarNieve(): void {
    this.nieveRamas = [];
    this.nieveSuelo = [];

    const ramas = [
      { cx: 140, cy: 170 }, { cx: 130, cy: 185 }, { cx: 155, cy: 160 },
      { cx: 260, cy: 175 }, { cx: 270, cy: 190 }, { cx: 248, cy: 165 },
      { cx: 120, cy: 220 }, { cx: 280, cy: 225 }
    ];
    ramas.forEach(pos => {
      this.nieveRamas.push({ cx: pos.cx, cy: pos.cy, r: 5 + Math.random() * 4 });
    });

    for (let i = 0; i < 12; i++) {
      this.nieveSuelo.push({
        cx: 130 + i * 14,
        cy: 312 + Math.random() * 6,
        r: 6 + Math.random() * 5
      });
    }
  }

  private seudoaleatorio(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // ─── Manual mode helpers ───

  get manualDia(): string {
    return this.manualDate.getDate().toString().padStart(2, '0');
  }

  get manualMesNombre(): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[this.manualDate.getMonth()];
  }

  get manualAnio(): number {
    return this.manualDate.getFullYear();
  }

  toggleManualMode(): void {
    this.manualMode = !this.manualMode;
    if (this.manualMode) {
      this.manualDate = new Date(this.horaSimulada);
    }
    this.recalc();
  }

  changeMonth(delta: number): void {
    const d = new Date(this.manualDate);
    d.setMonth(d.getMonth() + delta);
    this.manualDate = d;
    this.recalc();
  }

  changeYear(delta: number): void {
    const d = new Date(this.manualDate);
    d.setFullYear(d.getFullYear() + delta);
    this.manualDate = d;
    this.recalc();
  }

  changeDay(delta: number): void {
    const d = new Date(this.manualDate);
    d.setDate(d.getDate() + delta);
    this.manualDate = d;
    this.recalc();
  }

  onDateInput(value: string): void {
    if (value) {
      this.manualDate = new Date(value + 'T12:00:00');
      this.recalc();
    }
  }

  get dateInputValue(): string {
    const y = this.manualDate.getFullYear();
    const m = (this.manualDate.getMonth() + 1).toString().padStart(2, '0');
    const d = this.manualDate.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackParticle(_index: number, p: Particle): number {
    return p.id;
  }
}
