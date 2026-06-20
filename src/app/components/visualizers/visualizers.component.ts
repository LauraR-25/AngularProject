import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualizer-container">
      
      @switch (mode) {
        @case ('barra') {
          <div class="concept">
            <h3>El día como un progreso</h3>
            <div class="progress-bar"><div class="fill" [style.width.%]="dayProgress"></div></div>
          </div>
        }
        @case ('vela') {
          <div class="concept">
            <h3>Vela consumiéndose (12 horas por vela)</h3>
            <div class="candle" [style.height.px]="300 - (halfDayProgress * 3)">
              <div class="flame"></div>
            </div>
          </div>
        }
        @case ('sol-luna') {
          <div class="concept sky" [style.background-color]="skyColor">
            <h3>Ciclo Celeste</h3>
            <div class="sun-moon" [style.left.%]="dayProgress" [style.bottom.%]="sunAltitude">
              {{ isDay ? '☀️' : '🌕' }}
            </div>
          </div>
        }
        @case ('agua') {
          <div class="concept">
            <h3>Agua llenando la hora actual</h3>
            <div class="glass">
              <div class="water" [style.height.%]="hourProgress"></div>
            </div>
          </div>
        }
        @case ('color') {
          <div class="concept" [style.background-color]="hexColor" style="color: white; padding: 50px;">
            <h3>El tiempo es Color (Hex)</h3>
            <p>{{ hexColor }}</p>
          </div>
        }
        @case ('circulos') {
          <div class="concept">
            <h3>Órbitas concéntricas (H/M/S)</h3>
            <svg width="200" height="200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ddd" stroke-width="10"/>
              <circle cx="100" cy="100" r="90" fill="none" stroke="red" stroke-width="10" [attr.stroke-dasharray]="dayProgress * 5.6 + ', 600'"/>
              
              <circle cx="100" cy="100" r="70" fill="none" stroke="#ddd" stroke-width="10"/>
              <circle cx="100" cy="100" r="70" fill="none" stroke="blue" stroke-width="10" [attr.stroke-dasharray]="hourProgress * 4.4 + ', 500'"/>
              
              <circle cx="100" cy="100" r="50" fill="none" stroke="#ddd" stroke-width="10"/>
              <circle cx="100" cy="100" r="50" fill="none" stroke="green" stroke-width="10" [attr.stroke-dasharray]="minuteProgress * 3.1 + ', 400'"/>
            </svg>
          </div>
        }
        @case ('arena') {
          <div class="concept">
            <h3>Reloj de Arena (Por hora)</h3>
            <div class="hourglass-top"><div class="sand" [style.height.%]="100 - hourProgress"></div></div>
            <div class="hourglass-bottom"><div class="sand" [style.height.%]="hourProgress"></div></div>
          </div>
        }
        @case ('texto') {
          <div class="concept">
            <h3>Poesía temporal</h3>
            <p>El sol ha cruzado el {{ dayProgress | number:'1.0-0' }}% del cielo de hoy.</p>
            <p>La fracción actual de esta hora está llena al {{ hourProgress | number:'1.0-0' }}%.</p>
            <p>Fecha terrenal: {{ time | date:'fullDate' }}</p>
          </div>
        }
        @case ('bloques') {
          <div class="concept">
            <h3>Bloques de horas construidos</h3>
            <div class="blocks-grid">
              @for (h of [].constructor(24); track $index) {
                <div class="block" [class.filled]="$index < hours"></div>
              }
            </div>
          </div>
        }
        @case ('pendulo') {
          <div class="concept">
            <h3>Péndulo del Segundo</h3>
            <div class="pendulum" [style.transform]="'rotate(' + pendulumAngle + 'deg)'"></div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .visualizer-container { display: flex; justify-content: center; align-items: center; height: 400px; border: 1px solid #ccc; background: #f9f9f9; }
    .concept { text-align: center; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;}
    /* 1. Barra */ .progress-bar { width: 80%; height: 30px; background: #ddd; border-radius: 15px; overflow: hidden; } .fill { height: 100%; background: #4caf50; transition: width 1s linear; }
    /* 2. Vela */ .candle { width: 50px; background: #fff5e6; border: 1px solid #ddd; position: relative; border-radius: 5px 5px 0 0; border-bottom: none; transition: height 1s linear;} .flame { width: 20px; height: 30px; background: orange; border-radius: 50% 50% 20% 20%; position: absolute; top: -30px; left: 15px; }
    /* 3. Sol y luna */ .sky { transition: background 1s; overflow: hidden;} .sun-moon { font-size: 3rem; position: absolute; transition: all 1s linear; transform: translateX(-50%); }
    /* 4. Agua */ .glass { width: 100px; height: 200px; border: 3px solid #ccc; border-top: none; border-radius: 0 0 10px 10px; position: relative; overflow: hidden; } .water { background: rgba(0,150,255,0.5); position: absolute; bottom: 0; width: 100%; transition: height 1s linear;}
    /* 7. Arena */ .hourglass-top, .hourglass-bottom { width: 100px; height: 100px; border: 2px solid #333; position: relative; overflow: hidden; } .hourglass-top { border-radius: 0 0 50px 50px; border-bottom: none; } .hourglass-bottom { border-radius: 50px 50px 0 0; border-top: none; } .sand { background: #d2b48c; position: absolute; bottom: 0; width: 100%; transition: height 1s linear;}
    /* 9. Bloques */ .blocks-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; } .block { width: 30px; height: 30px; background: #eee; } .block.filled { background: #333; }
    /* 10. Pendulo */ .pendulum { width: 5px; height: 150px; background: #333; transform-origin: top center; transition: transform 0.5s ease-in-out; }
  `]
})
export class VisualizersComponent implements OnChanges {
  @Input() time!: Date;
  @Input() mode: string = 'barra';

  // Variables calculadas
  hours = 0; minutes = 0; seconds = 0;
  dayProgress = 0;
  halfDayProgress = 0;
  hourProgress = 0;
  minuteProgress = 0;
  skyColor = '';
  isDay = true;
  sunAltitude = 0;
  hexColor = '';
  pendulumAngle = 0;

  ngOnChanges() {
    if (!this.time) return;

    this.hours = this.time.getHours();
    this.minutes = this.time.getMinutes();
    this.seconds = this.time.getSeconds();

    const totalSecondsInDay = 86400;
    const currentSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
    
    this.dayProgress = (currentSeconds / totalSecondsInDay) * 100;
    this.halfDayProgress = ((currentSeconds % 43200) / 43200) * 100; // Ciclos de 12 horas
    this.hourProgress = ((this.minutes * 60 + this.seconds) / 3600) * 100;
    this.minuteProgress = (this.seconds / 60) * 100;

    // Lógica Sol y Luna
    this.isDay = this.hours >= 6 && this.hours < 18;
    this.skyColor = this.isDay ? '#87CEEB' : '#0B0C10';
    // Parábola simple para la altitud
    this.sunAltitude = Math.sin((currentSeconds % 43200) / 43200 * Math.PI) * 80; 

    // Lógica Hexadecimal
    const pad = (n: number) => n.toString().padStart(2, '0');
    this.hexColor = `#${pad(this.hours)}${pad(this.minutes)}${pad(this.seconds)}`;

    // Lógica Péndulo (-30 a 30 grados basándose en segundos pares/impares)
    this.pendulumAngle = this.seconds % 2 === 0 ? 30 : -30;
  }
}