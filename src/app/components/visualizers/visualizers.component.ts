import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sky-wrapper" [style.background]="skyGradient">
      <!-- Estrellas (solo de noche) -->
      @if (!isDay) {
        <div class="stars">
          @for (s of stars; track $index) {
            <div class="star" [style]="s"></div>
          }
        </div>
      }

      <!-- Nube decorativa (solo de día) -->
      @if (isDay) {
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
      }

      <!-- Cuerpo celeste (Sol o Luna) -->
      <div
        class="celestial-body"
        [class.is-sun]="isDay"
        [class.is-moon]="!isDay"
        [style.left.%]="bodyX"
        [style.bottom.%]="bodyY"
      >
        {{ isDay ? '☀️' : '🌕' }}
      </div>

      <!-- Línea del horizonte -->
      <div class="horizon"></div>

      <!-- Panel de información -->
      <div class="info-overlay">
        <span class="info-badge">
          {{ isDay ? '☀ DÍA' : '🌑 NOCHE' }}
        </span>
        <span class="info-time">{{ time | date:'HH:mm:ss' }}</span>
        <span class="info-progress">{{ dayProgress | number:'1.0-0' }}% del día</span>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

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
    .cloud-1::after { width: 50px; height: 50px; top: -20px; left: 50px; }
    .cloud-2 {
      width: 80px; height: 28px;
      top: 30%; left: 60%;
      animation: driftCloud 40s linear infinite reverse;
      opacity: 0.5;
    }
    .cloud-2::before { width: 50px; height: 50px; top: -22px; left: 10px; }
    @keyframes driftCloud {
      from { transform: translateX(-200px); }
      to { transform: translateX(calc(100vw + 200px)); }
    }

    /* ===== CUERPO CELESTE ===== */
    .celestial-body {
      position: absolute;
      font-size: 3.5rem;
      transform: translateX(-50%);
      transition: left 1s linear, bottom 1s linear;
      filter: drop-shadow(0 0 0px transparent);
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
      50% { filter: drop-shadow(0 0 40px rgba(255, 200, 50, 1)); }
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
  @Input() time!: Date;
  @Input() mode: string = 'sol-luna'; // Fijo en sol-luna

  // Datos calculados
  hours = 0;
  minutes = 0;
  seconds = 0;
  dayProgress = 0;
  isDay = true;
  skyGradient = '';
  bodyX = 50;  // posición horizontal del sol/luna (%)
  bodyY = 50;  // posición vertical del sol/luna (%)

  // Estrellas decorativas
  stars = Array.from({ length: 60 }, () => {
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

  ngOnChanges() {
    if (!this.time) return;

    this.hours = this.time.getHours();
    this.minutes = this.time.getMinutes();
    this.seconds = this.time.getSeconds();

    const totalSecondsInDay = 86400;
    const currentSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
    this.dayProgress = (currentSeconds / totalSecondsInDay) * 100;

    // Determinar si es de día (6:00 – 18:00)
    this.isDay = this.hours >= 6 && this.hours < 18;

    // === Posición horizontal ===
    // El sol/luna viaja de izq (0%) a der (100%) durante su ciclo de 12h
    const cycleSeconds = currentSeconds % 43200; // ciclo de 12h
    this.bodyX = (cycleSeconds / 43200) * 90 + 5; // entre 5% y 95%

    // === Posición vertical (parábola) ===
    // Sin(0..π) = 0→1→0, multiplicado por un techo máximo
    const arcAngle = (cycleSeconds / 43200) * Math.PI;
    this.bodyY = Math.sin(arcAngle) * 65 + 5; // entre 5% y 70%

    // === Gradiente del cielo ===
    this.skyGradient = this.buildSkyGradient(currentSeconds);
  }

  private buildSkyGradient(secs: number): string {
    const totalSecs = 86400;
    const pct = secs / totalSecs; // 0 a 1 durante el día completo

    // Paletas por franja horaria
    if (secs < 21600) {
      // Madrugada (0-6h): negro profundo → azul medianoche
      const t = secs / 21600;
      return `linear-gradient(to bottom, #000010 0%, #050a1a ${30 + t * 20}%, #0b1a35 100%)`;
    } else if (secs < 25200) {
      // Amanecer (6-7h): naranja/rosado
      return `linear-gradient(to bottom, #1a0a2e 0%, #8b2252 30%, #e8621a 65%, #f9a743 100%)`;
    } else if (secs < 43200) {
      // Mañana (7-12h): cielo azul claro
      const t = (secs - 25200) / (43200 - 25200);
      return `linear-gradient(to bottom, #1c6ab0 0%, #3a9bd5 ${40 + t * 20}%, #87ceeb 100%)`;
    } else if (secs < 57600) {
      // Tarde (12-16h): azul intenso
      return `linear-gradient(to bottom, #0a4a8c 0%, #1a6bb8 40%, #5aace0 100%)`;
    } else if (secs < 68400) {
      // Atardecer (16-19h): dorado/naranja
      return `linear-gradient(to bottom, #0d1b4b 0%, #7b2d5c 25%, #e85d1a 55%, #f4a800 100%)`;
    } else {
      // Noche (19-24h): negro estelar
      const t = (secs - 68400) / (86400 - 68400);
      return `linear-gradient(to bottom, #000005 0%, #03051a ${20 + t * 15}%, #060e24 100%)`;
    }
  }
}