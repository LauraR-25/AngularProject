import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeService } from './services/time.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { MlpVisualizerComponent } from './components/visualizers/mlp/mlp-visualizer.component';
import { DetroitVisualizerComponent } from './components/visualizers/detroit/detroit-visualizer.component';
import { VelaComponent } from './components/visualizers/vela/vela.component';
import { ArbolComponent } from './components/visualizers/arbol/arbol.component';
import { PenduloComponent } from './components/visualizers/pendulo/pendulo.component';
import { AppleWatchComponent } from './components/visualizers/watch/apple-watch.component';
import { MechanicalClockComponent } from './components/visualizers/mechanical/mechanical-clock.component';
import { EcualizadorComponent } from './components/visualizers/ecualizador/ecualizador.component';
import { RadarComponent } from './components/visualizers/radar/radar.component';
import { BarcodeComponent } from './components/visualizers/barcode/barcode.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthComponent,
    VelaComponent,
    MlpVisualizerComponent,
    DetroitVisualizerComponent,
    ArbolComponent,
    PenduloComponent,
    AppleWatchComponent,
    MechanicalClockComponent,
    EcualizadorComponent,
    RadarComponent,
    BarcodeComponent
  ],
  template: `
    <div class="app-shell">
      @if (!(authService.authStatus$ | async)) {
        <app-auth></app-auth>
      } @else {
        <div class="dashboard">

          <!-- ═══════ HEADER ═══════ -->
          <header class="dash-header">
            <div class="header-clock header-clock-left">
              <span class="clock-label">HORA SIMULADA</span>
              <span class="clock-time">{{ (timeService.currentTime$ | async) | date:'HH:mm:ss' }}</span>
            </div>

            <h1 class="app-title">Visualizador de tiempo</h1>

            <div class="header-right">
              @if (timeService.speed !== 1 || timeService.paused) {
                <span class="header-badge">
                  @if (timeService.paused) { ⏸ PAUSA } @else { {{ timeService.speed }}x }
                </span>
              }
              <button id="logout-btn" class="btn-logout" (click)="authService.logout()">
                ⏻ Salir
              </button>
            </div>
          </header>

          <!-- ═══════ MAIN 3-COLUMN ═══════ -->
          <main class="dash-main">

            <!-- ──── COLUMNA IZQUIERDA: Modos ──── -->
            <aside class="panel-left">
              <nav class="mode-list">
                <span class="panel-label">VISUALIZACIÓN</span>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'vela'"
                  (click)="changeMode('vela')">Vela de Tiempo</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'mlp'"
                  (click)="changeMode('mlp')">My Little Pony</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'detroit'"
                  (click)="changeMode('detroit')">Detroit: Become Human</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'pendulo'"
                  (click)="changeMode('pendulo')">Péndulo de Newton</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'watch'"
                  (click)="changeMode('watch')">Apple Watch</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'mechanical'"
                  (click)="changeMode('mechanical')">Reloj Mecánico</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'arbol'"
                  (click)="changeMode('arbol')">Estaciones del Árbol</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'ecualizador'"
                  (click)="changeMode('ecualizador')">Ecualizador Sintetizado</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'radar'"
                  (click)="changeMode('radar')">Radar Orbital</button>
                <button type="button" class="mode-item"
                  [class.active]="currentMode === 'barcode'"
                  (click)="changeMode('barcode')">Código de Barras</button>
              </nav>

              <div class="sim-info">
                <span class="sim-info-label">TIEMPO REAL</span>
                <span class="sim-info-value">{{ realTime | date:'HH:mm:ss' }}</span>
              </div>
            </aside>

            <!-- ──── CENTRO: Visualizador ──── -->
            <section class="visualizer-stage">
              @switch (currentMode) {
                @case ('vela') {
                  <app-vela [currentTime]="(timeService.currentTime$ | async)"></app-vela>
                }
                @case ('mlp') {
                  <app-mlp-visualizer [currentTimeInput]="(timeService.currentTime$ | async)"></app-mlp-visualizer>
                }
                @case ('detroit') {
                  <app-detroit-visualizer></app-detroit-visualizer>
                }
                @case ('arbol') {
                  @if (timeService.currentTime$ | async; as arbolTime) {
                    <app-arbol [currentTime]="arbolTime"></app-arbol>
                  }
                }
                @case ('pendulo') {
                  <app-pendulo [currentTime]="(timeService.currentTime$ | async)"></app-pendulo>
                }
                @case ('watch') {
                  @if (timeService.currentTime$ | async; as watchTime) {
                    <app-apple-watch [currentTime]="watchTime"></app-apple-watch>
                  }
                }
                @case ('mechanical') {
                  @if (timeService.currentTime$ | async; as mechTime) {
                    <app-mechanical-clock [currentTime]="mechTime"></app-mechanical-clock>
                  }
                }
                @case ('ecualizador') {
                  <app-ecualizador [currentTime]="(timeService.currentTime$ | async)"></app-ecualizador>
                }
                @case ('radar') {
                  <app-radar [currentTime]="(timeService.currentTime$ | async)"></app-radar>
                }
                @case ('barcode') {
                  <app-barcode [currentTime]="(timeService.currentTime$ | async)"></app-barcode>
                }
              }
            </section>

            <!-- ──── COLUMNA DERECHA: Panel de Control ──── -->
            <aside class="panel-right">
              <span class="panel-label panel-right-title">PANEL DE CONTROL</span>

              <!-- ══ SECCIÓN 1: Desfase Tripartito ══ -->
              <div class="pr-section">
                <div class="pr-section-head">
                  <span class="pr-section-title">DESFASJE HORARIO</span>
                  <span class="pr-offset-badge"
                        [class.active]="offsetHours !== 0 || offsetMinutes !== 0 || offsetSeconds !== 0">
                    {{ formattedOffset }}
                  </span>
                </div>

                <div class="pr-slider-group">
                  <div class="pr-slider-row">
                    <label class="pr-slider-label">Horas</label>
                    <span class="pr-slider-val"
                          [class.nonzero]="offsetHours !== 0">{{ offsetHours > 0 ? '+' : '' }}{{ offsetHours }}h</span>
                  </div>
                  <input type="range" class="pr-range" min="-23" max="24"
                         [(ngModel)]="offsetHours" (input)="updateOffset()" />
                </div>

                <div class="pr-slider-group">
                  <div class="pr-slider-row">
                    <label class="pr-slider-label">Minutos</label>
                    <span class="pr-slider-val"
                          [class.nonzero]="offsetMinutes !== 0">{{ offsetMinutes > 0 ? '+' : '' }}{{ offsetMinutes }}m</span>
                  </div>
                  <input type="range" class="pr-range" min="-59" max="59"
                         [(ngModel)]="offsetMinutes" (input)="updateOffset()" />
                </div>

                <div class="pr-slider-group">
                  <div class="pr-slider-row">
                    <label class="pr-slider-label">Segundos</label>
                    <span class="pr-slider-val"
                          [class.nonzero]="offsetSeconds !== 0">{{ offsetSeconds > 0 ? '+' : '' }}{{ offsetSeconds }}s</span>
                  </div>
                  <input type="range" class="pr-range" min="-59" max="59"
                         [(ngModel)]="offsetSeconds" (input)="updateOffset()" />
                </div>
              </div>

              <!-- ══ SECCIÓN 2: Velocidad ══ -->
              <div class="pr-section">
                <div class="pr-section-head">
                  <span class="pr-section-title">VELOCIDAD</span>
                  <span class="pr-speed-badge" [class.nominal]="currentSpeed === 1">{{ currentSpeed }}x</span>
                </div>
                <div class="pr-speed-grid">
                  @for (s of speedOptions; track s) {
                    <button type="button" class="pr-speed-chip"
                            [class.active]="currentSpeed === s"
                            (click)="setSpeed(s)">{{ s }}x</button>
                  }
                </div>
              </div>

              <!-- ══ SECCIÓN 3: Reproducción ══ -->
              <div class="pr-section">
                <div class="pr-section-head">
                  <span class="pr-section-title">REPRODUCCIÓN</span>
                </div>
                <div class="pr-playback-row">
                  <button type="button" class="pr-pb-btn pr-play"
                          [class.highlight]="timeService.paused"
                          [disabled]="!timeService.paused"
                          (click)="resume()">
                    <span class="pb-icon">▶</span>
                    <span class="pb-text">Play</span>
                  </button>
                  <button type="button" class="pr-pb-btn pr-pause"
                          [class.highlight]="!timeService.paused"
                          [disabled]="timeService.paused"
                          (click)="pause()">
                    <span class="pb-icon">⏸</span>
                    <span class="pb-text">Pause</span>
                  </button>
                </div>
              </div>

              <button type="button" class="pr-reset-btn" (click)="resetAll()">
                ↺ Restablecer Todo
              </button>
            </aside>

          </main>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ═══════════════════════════════════════════
       RESET / BASE
       ═══════════════════════════════════════════ */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .app-shell {
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      background: #0a0a0a;
    }

    /* ═══════════════════════════════════════════
       DASHBOARD
       ═══════════════════════════════════════════ */
    .dashboard {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* ═══════════════════════════════════════════
       HEADER
       ═══════════════════════════════════════════ */
    .dash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      height: 64px;
      background: #0d0d0d;
      border-bottom: 1px solid #1e1e1e;
      flex-shrink: 0;
    }

    .app-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #ffffff;
      text-align: center;
      flex: 1;
      text-shadow: 0 0 12px rgba(230, 57, 70, 0.4);
    }

    .header-clock {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 140px;
    }
    .clock-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.45rem;
      letter-spacing: 0.2em;
      color: #555;
    }
    .clock-time {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #e63946;
      text-shadow: 0 0 16px rgba(230, 57, 70, 0.5);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 140px;
      justify-content: flex-end;
    }

    .header-badge {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.25);
      border-radius: 3px;
      padding: 4px 10px;
      text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
    }

    .btn-logout {
      background: transparent;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      color: #555;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      padding: 8px 14px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-logout:hover {
      border-color: #e63946;
      color: #e63946;
    }

    /* ═══════════════════════════════════════════
       MAIN 3-COLUMN LAYOUT
       ═══════════════════════════════════════════ */
    .dash-main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ═══════════════════════════════════════════
       PANEL IZQUIERDO — Lista de modos
       ═══════════════════════════════════════════ */
    .panel-left {
      width: 240px;
      flex-shrink: 0;
      background: #0d0d0d;
      border-right: 1px solid #1e1e1e;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
    }

    .panel-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: #555;
      display: block;
      margin-bottom: 4px;
    }

    .mode-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .mode-item {
      width: 100%;
      text-align: left;
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      color: #bbb;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.06em;
      padding: 11px 12px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .mode-item:hover {
      border-color: #e63946;
      color: #fff;
    }
    .mode-item.active {
      background: rgba(230, 57, 70, 0.12);
      border-color: #e63946;
      color: #fff;
      box-shadow: 0 0 10px rgba(230, 57, 70, 0.25);
    }

    .sim-info {
      margin-top: auto;
      background: #0a0a0a;
      border: 1px solid #1e1e1e;
      border-radius: 4px;
      padding: 12px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sim-info-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.45rem;
      letter-spacing: 0.15em;
      color: #333;
    }
    .sim-info-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      color: #888;
    }

    /* ═══════════════════════════════════════════
       ESCENARIO DEL VISUALIZADOR (centro)
       ═══════════════════════════════════════════ */
    .visualizer-stage {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .visualizer-stage app-vela,
    .visualizer-stage app-mlp-visualizer,
    .visualizer-stage app-detroit-visualizer,
    .visualizer-stage app-pendulo,
    .visualizer-stage app-apple-watch,
    .visualizer-stage app-mechanical-clock,
    .visualizer-stage app-arbol,
    .visualizer-stage app-ecualizador,
    .visualizer-stage app-radar,
    .visualizer-stage app-barcode {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* ═══════════════════════════════════════════
       PANEL DERECHO — Control neon
       ═══════════════════════════════════════════ */
    .panel-right {
      width: 280px;
      flex-shrink: 0;
      background: #0a0b10;
      border-left: 1px solid rgba(0, 240, 255, 0.12);
      box-shadow: inset 2px 0 30px rgba(0, 240, 255, 0.025);
      padding: 24px 18px;
      display: flex;
      flex-direction: column;
      gap: 22px;
      overflow-y: auto;
    }

    .panel-right-title {
      color: #00f0ff !important;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
      font-size: 0.55rem !important;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.1);
    }

    /* ── Secciones ── */
    .pr-section {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .pr-section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pr-section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #00f0ff;
      text-shadow: 0 0 6px rgba(0, 240, 255, 0.25);
    }

    /* ── Badge desfase ── */
    .pr-offset-badge {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      color: #333;
      transition: color 0.3s, text-shadow 0.3s;
    }
    .pr-offset-badge.active {
      color: #00f0ff;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    }

    /* ── Sliders ── */
    .pr-slider-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .pr-slider-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pr-slider-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      font-weight: 400;
      color: #666;
      letter-spacing: 0.04em;
    }

    .pr-slider-val {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      color: #444;
      min-width: 44px;
      text-align: right;
      transition: color 0.2s;
    }
    .pr-slider-val.nonzero {
      color: #00f0ff;
      text-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
    }

    .pr-range {
      width: 100%;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: #1a1b24;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }
    .pr-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #00f0ff;
      border: 2px solid #0a0b10;
      box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .pr-range::-webkit-slider-thumb:hover {
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.9);
    }
    .pr-range::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #00f0ff;
      border: 2px solid #0a0b10;
      box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
      cursor: pointer;
    }

    /* ── Velocidad badge ── */
    .pr-speed-badge {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      color: #00f0ff;
      text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
      transition: color 0.3s;
    }
    .pr-speed-badge.nominal {
      color: #333;
      text-shadow: none;
    }

    /* ── Speed chips ── */
    .pr-speed-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
    }

    .pr-speed-chip {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.55rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #555;
      background: #111218;
      border: 1px solid #222;
      border-radius: 3px;
      padding: 8px 0;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    .pr-speed-chip:hover {
      border-color: #00f0ff;
      color: #00f0ff;
    }
    .pr-speed-chip.active {
      background: rgba(0, 240, 255, 0.12);
      border-color: #00f0ff;
      color: #00f0ff;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
      text-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
    }

    /* ── Playback ── */
    .pr-playback-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .pr-pb-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: #111218;
      border: 1px solid #222;
      border-radius: 6px;
      padding: 14px 8px;
      cursor: pointer;
      transition: all 0.25s;
      opacity: 0.35;
    }
    .pr-pb-btn:disabled {
      cursor: default;
    }
    .pr-pb-btn.highlight {
      opacity: 1;
      border-color: #00f0ff;
      box-shadow: 0 0 14px rgba(0, 240, 255, 0.15);
    }
    .pr-pb-btn.highlight:hover {
      box-shadow: 0 0 22px rgba(0, 240, 255, 0.3);
    }

    .pb-icon {
      font-size: 1.3rem;
      line-height: 1;
      color: #00f0ff;
      transition: text-shadow 0.2s;
    }
    .pr-pb-btn.highlight .pb-icon {
      text-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
    }

    .pb-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #00f0ff;
    }

    /* ── Reset ── */
    .pr-reset-btn {
      margin-top: auto;
      width: 100%;
      background: transparent;
      border: 1px solid #1e1e1e;
      border-radius: 4px;
      color: #444;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.55rem;
      letter-spacing: 0.1em;
      padding: 10px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .pr-reset-btn:hover {
      border-color: #00f0ff;
      color: #00f0ff;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.12);
    }
  `]
})
export class AppComponent {
  timeService = inject(TimeService);
  authService = inject(AuthService);

  currentMode = 'vela';
  realTime = new Date();

  offsetHours = 0;
  offsetMinutes = 0;
  offsetSeconds = 0;

  speedOptions = [0.5, 1, 2, 5, 10];
  currentSpeed = 1;

  constructor() {
    setInterval(() => this.realTime = new Date(), 1000);
  }

  get formattedOffset(): string {
    const total = this.offsetHours * 3600 + this.offsetMinutes * 60 + this.offsetSeconds;
    if (total === 0) return '00:00:00';
    const sign = total > 0 ? '+' : '-';
    const abs = Math.abs(total);
    const h = String(Math.floor(abs / 3600)).padStart(2, '0');
    const m = String(Math.floor((abs % 3600) / 60)).padStart(2, '0');
    const s = String(abs % 60).padStart(2, '0');
    return `${sign}${h}:${m}:${s}`;
  }

  changeMode(mode: string): void {
    this.currentMode = mode;
  }

  updateOffset(): void {
    this.timeService.setOffset(this.offsetHours, this.offsetMinutes, this.offsetSeconds);
  }

  setSpeed(speed: number): void {
    this.currentSpeed = speed;
    this.timeService.setSpeed(speed);
  }

  pause(): void {
    this.timeService.pause();
  }

  resume(): void {
    this.timeService.resume();
  }

  resetAll(): void {
    this.offsetHours = 0;
    this.offsetMinutes = 0;
    this.offsetSeconds = 0;
    this.currentSpeed = 1;
    this.timeService.resetAll();
  }
}
