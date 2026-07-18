import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeService } from './services/time.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { VisualizersComponent } from './components/visualizers/visualizers.component';
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
    VisualizersComponent,
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
        <!-- ===== VISTA: AUTH ===== -->
        <app-auth></app-auth>
      } @else {
        <!-- ===== VISTA: DASHBOARD ===== -->
        <div class="dashboard">

          <!-- Header -->
          <header class="dash-header">
            <div class="header-clock header-clock-left">
              <span class="clock-label">HORA SIMULADA</span>
              <span class="clock-time">{{ (timeService.currentTime$ | async) | date:'HH:mm:ss' }}</span>
            </div>

            <h1 class="app-title">Visualizador de tiempo</h1>

            <button id="logout-btn" class="btn-logout" (click)="authService.logout()">
              ⏻ Salir
            </button>
          </header>

          <!-- Contenido principal -->
          <main class="dash-main">

            <!-- Panel de control del tiempo (columna izquierda) -->
            <aside class="controls-panel">

              <!-- Lista vertical de modos -->
              <nav class="mode-list">
                <span class="mode-list-title">MODO DE VISUALIZACIÓN</span>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'vela'"
                  (click)="changeMode('vela')"
                >Vela de Tiempo</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'mlp'"
                  (click)="changeMode('mlp')"
                >My Little Pony</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'detroit'"
                  (click)="changeMode('detroit')"
                >Detroit: Become Human</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'pendulo'"
                  (click)="changeMode('pendulo')"
                >Péndulo de Newton</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'watch'"
                  (click)="changeMode('watch')"
                >Apple Watch</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'mechanical'"
                  (click)="changeMode('mechanical')"
                >Reloj Mecánico</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'arbol'"
                  (click)="changeMode('arbol')"
                >Estaciones del Árbol</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'ecualizador'"
                  (click)="changeMode('ecualizador')"
                >Ecualizador Sintetizado</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'radar'"
                  (click)="changeMode('radar')"
                >Radar Orbital</button>
                <button
                  type="button"
                  class="mode-item"
                  [class.active]="currentMode === 'barcode'"
                  (click)="changeMode('barcode')"
                >Código de Barras</button>
              </nav>

              <button id="reset-time-btn" class="btn-reset" (click)="resetTime()">
                ↺ Restablecer al presente
              </button>

              <!-- Desfase de horario (parte inferior izquierda) -->
              <div class="offset-group">
                <div class="offset-labels">
                  <label class="field-label">DESFASE HORARIO</label>
                  <span class="offset-value" [class.negative]="timeOffset < 0" [class.positive]="timeOffset > 0">
                    {{ timeOffset > 0 ? '+' : '' }}{{ timeOffset }}h
                  </span>
                </div>
                <input
                  id="time-offset-slider"
                  type="range"
                  class="time-slider"
                  min="-24" max="24"
                  [(ngModel)]="timeOffset"
                  (input)="updateTime()"
                />
                <div class="slider-range-labels">
                  <span>-24h</span>
                  <span>Presente</span>
                  <span>+24h</span>
                </div>
              </div>

              <!-- Info del simulador -->
              <div class="sim-info">
                <div class="sim-info-row">
                  <span class="sim-info-label">TIEMPO REAL</span>
                  <span class="sim-info-value">{{ realTime | date:'HH:mm:ss' }}</span>
                </div>
              </div>
            </aside>

            <!-- Visualizador -->
            <section class="visualizer-stage">
              @switch (currentMode) {
                @case ('vela') {
                  <app-vela [currentTime]="(timeService.currentTime$ | async)"></app-vela>
                }
                @case ('mlp') {
                  <app-mlp-visualizer></app-mlp-visualizer>
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

          </main>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');

    /* ===== RESET / BASE ===== */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .app-shell {
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      background: #0a0a0a;
    }

    /* ===== DASHBOARD SHELL ===== */
    .dashboard {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* ===== HEADER ===== */
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

    /* ===== MAIN LAYOUT ===== */
    .dash-main {
      display: flex;
      flex: 1;
      overflow: hidden;
      gap: 0;
    }

    /* ===== PANEL DE CONTROLES (columna izquierda) ===== */
    .controls-panel {
      width: 260px;
      flex-shrink: 0;
      background: #0d0d0d;
      border-right: 1px solid #1e1e1e;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }

    /* Lista vertical de modos */
    .mode-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .mode-list-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.55rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #555;
      margin-bottom: 4px;
    }
    .mode-item {
      width: 100%;
      text-align: left;
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      color: #bbb;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      padding: 12px 14px;
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

    .offset-group { display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
    .offset-labels {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .field-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      color: #555;
    }
    .offset-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      color: #555;
      transition: color 0.3s;
    }
    .offset-value.negative { color: #e63946; }
    .offset-value.positive { color: #ffd60a; }

    /* Slider personalizado */
    .time-slider {
      width: 100%;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: #1e1e1e;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }
    .time-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #e63946;
      border: 2px solid #0d0d0d;
      box-shadow: 0 0 8px rgba(230, 57, 70, 0.6);
      cursor: pointer;
    }
    .time-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #e63946;
      border: 2px solid #0d0d0d;
      box-shadow: 0 0 8px rgba(230, 57, 70, 0.6);
      cursor: pointer;
    }
    .slider-range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.6rem;
      color: #333;
    }

    .btn-reset {
      width: 100%;
      background: transparent;
      border: 1px solid #2a2a2a;
      border-radius: 3px;
      color: #555;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      padding: 10px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .btn-reset:hover {
      border-color: #ffd60a;
      color: #ffd60a;
      box-shadow: 0 0 10px rgba(255, 214, 10, 0.15);
    }

    /* Info del simulador */
    .sim-info {
      background: #0a0a0a;
      border: 1px solid #1e1e1e;
      border-radius: 4px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: auto;
    }
    .sim-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sim-info-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.5rem;
      letter-spacing: 0.15em;
      color: #333;
    }
    .sim-info-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      color: #888;
    }

    /* ===== ESCENARIO DEL VISUALIZADOR (centrado y flexible) ===== */
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
    .visualizer-stage app-barcode,
    .visualizer-stage app-visualizers {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {
  timeService = inject(TimeService);
  authService = inject(AuthService);

  currentMode: string = 'vela'; // Por defecto inicia en la Vela de Tiempo
  timeOffset: number = 0;
  realTime = new Date();

  constructor() {
    // Actualizar la hora real cada segundo para mostrarla en el panel
    setInterval(() => this.realTime = new Date(), 1000);
  }

  changeMode(mode: string): void {
    this.currentMode = mode;
  }

  updateTime() {
    this.timeService.setOffset(this.timeOffset);
  }

  resetTime() {
    this.timeOffset = 0;
    this.updateTime();
  }
}
