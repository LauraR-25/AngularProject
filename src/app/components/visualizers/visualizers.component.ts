import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSimulatorService, CelestialState } from '../../services/time-simulator.service';

@Component({
  selector: 'app-visualizers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sky-wrapper" [style.background]="state.skyGradient">
      <!-- Estrellas (solo de noche) -->
      @if (!state.isDay) {
        <div class="stars">
          @for (s of stars; track $index) {
            <div class="star" [style]="s"></div>
          }
        </div>
      }

      <!-- Nubes decorativas (solo de día) -->
      @if (state.isDay) {
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
      }

      <!-- Cuerpo celeste (Sol o Luna) -->
      <div
        class="celestial-body"
        [class.is-sun]="state.isDay"
        [class.is-moon]="!state.isDay"
        [style.left.%]="state.bodyX"
        [style.bottom.%]="state.bodyY"
      >
        {{ state.isDay ? '☀️' : '🌕' }}
      </div>

      <!-- Línea del horizonte -->
      <div class="horizon"></div>

      <!-- Panel de información -->
      <div class="info-overlay">
        <span class="info-badge">
          {{ state.isDay ? '☀ DÍA' : '🌑 NOCHE' }}
        </span>
        <span class="info-time">{{ time | date:'HH:mm:ss' }}</span>
        <span class="info-progress">{{ state.dayProgress | number:'1.0-0' }}% del día</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }

    .sky-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 400px;
      overflow: hidden;
      border-radius: 8px;
      transition: background 3s ease;
    }

    /* ===== ESTRELLAS ===== */
    .stars { position: absolute; inset: 0; }
    .star {
      position: absolute;
      border-radius: 50%;
      background: white;
      animation: twinkle ease-in-out infinite;
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* ===== NUBES ===== */
    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50px;
      filter: blur(4px);
    }
    .cloud::before, .cloud::after {
      content: '';
      position: absolute;
      background: inherit;
      border-radius: 50%;
    }
    .cloud-1 {
      width: 120px; height: 40px;
      top: 20%; left: 15%;
      animation: driftCloud 30s linear infinite;
    }
    .cloud-1::before { width: 70px; height: 70px; top: -30px; left: 15px; }
    .cloud-1::after  { width: 50px; height: 50px; top: -20px; left: 50px; }
    .cloud-2 {
      width: 80px; height: 28px;
      top: 30%; left: 60%;
      animation: driftCloud 40s linear infinite reverse;
      opacity: 0.5;
    }
    .cloud-2::before { width: 50px; height: 50px; top: -22px; left: 10px; }
    @keyframes driftCloud {
      from { transform: translateX(-200px); }
      to   { transform: translateX(calc(100vw + 200px)); }
    }

    /* ===== CUERPO CELESTE ===== */
    .celestial-body {
      position: absolute;
      font-size: 3.5rem;
      transform: translateX(-50%);
      transition: left 1s linear, bottom 1s linear;
      line-height: 1;
    }
    .celestial-body.is-sun {
      filter: drop-shadow(0 0 24px rgba(255, 200, 50, 0.9));
      animation: sunGlow 3s ease-in-out infinite;
    }
    .celestial-body.is-moon {
      filter: drop-shadow(0 0 18px rgba(180, 210, 255, 0.8));
    }
    @keyframes sunGlow {
      0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 200, 50, 0.8)); }
      50%       { filter: drop-shadow(0 0 40px rgba(255, 200, 50, 1));   }
    }

    /* ===== HORIZONTE ===== */
    .horizon {
      position: absolute;
      bottom: 0;
      left: 0; right: 0;
      height: 80px;
      background: linear-gradient(to top, rgba(0,0,0,0.25), transparent);
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    /* ===== INFO OVERLAY ===== */
    .info-overlay {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 100px;
      padding: 8px 20px;
      white-space: nowrap;
    }
    .info-badge {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #ffd60a;
    }
    .info-time {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      color: #ffffff;
    }
    .info-progress {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      color: rgba(255,255,255,0.5);
    }
  `]
})
export class VisualizersComponent implements OnChanges {
  // ── Entradas del componente ──────────────────────────────────────
  @Input() time!: Date;
  @Input() mode: string = 'sol-luna';

  // ── Dependencias ────────────────────────────────────────────────
  private simulator = inject(TimeSimulatorService);

  // ── Estado derivado (calculado por el servicio) ──────────────────
  state: CelestialState = this.simulator.compute(new Date());

  // ── Datos estáticos de decoración (generados una sola vez) ───────
  readonly stars = Array.from({ length: 60 }, () => {
    const size = Math.random() * 2.5 + 0.5;
    return `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 75}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 4 + 2}s;
      animation-delay: ${Math.random() * -5}s;
    `;
  });

  // ── Ciclo de vida ────────────────────────────────────────────────
  ngOnChanges(): void {
    if (!this.time) return;
    // Toda la lógica de cálculo vive en el servicio.
    // El componente solo delega y recibe el resultado.
    this.state = this.simulator.compute(this.time);
  }
}