import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeService } from './services/time.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { VisualizersComponent } from './components/visualizers/visualizers.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthComponent, VisualizersComponent],
  template: `
    <div class="main-wrapper">
      <header>
        <h1>Conceptos del Tiempo</h1>
        @if (authService.authStatus$ | async) {
          <button (click)="authService.logout()">Cerrar Sesión</button>
        }
      </header>

      <main>
        @if (!(authService.authStatus$ | async)) {
          <app-auth></app-auth>
        } @else {
          <div class="controls panel">
            <label>Selecciona un visualizador:</label>
            <select [(ngModel)]="selectedMode">
              <option value="barra">1. Barra de Progreso Diario</option>
              <option value="vela">2. Vela Consumiéndose</option>
              <option value="sol-luna">3. Ciclo Sol y Luna</option>
              <option value="agua">4. Vaso de Agua (Por hora)</option>
              <option value="color">5. Color Hexadecimal</option>
              <option value="circulos">6. Órbitas Concéntricas</option>
              <option value="arena">7. Reloj de Arena</option>
              <option value="texto">8. Poesía Descriptiva</option>
              <option value="bloques">9. Bloques de Construcción</option>
              <option value="pendulo">10. Péndulo</option>
            </select>

            <div class="time-manipulator">
              <label>Alterar el tejido del tiempo (Horas de desfase): {{ timeOffset }}h</label>
              <input type="range" min="-24" max="24" [(ngModel)]="timeOffset" (input)="updateTime()">
              <button (click)="resetTime()">Restablecer al presente</button>
            </div>
            
            <p class="real-time-display">Hora del simulador: {{ (timeService.currentTime$ | async) | date:'mediumTime' }}</p>
          </div>

          <div class="visualizer-stage panel">
            <app-visualizers 
              [time]="(timeService.currentTime$ | async)!" 
              [mode]="selectedMode">
            </app-visualizers>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .main-wrapper { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
    .panel { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .controls { display: flex; flex-direction: column; gap: 15px; }
    select, input[type="range"] { padding: 10px; width: 100%; }
    .time-manipulator { background: #f0f4f8; padding: 15px; border-radius: 5px; display: flex; flex-direction: column; gap: 10px; }
    button { padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .real-time-display { font-weight: bold; font-size: 1.2rem; text-align: center; }
  `]
})
export class AppComponent {
  timeService = inject(TimeService);
  authService = inject(AuthService);

  selectedMode: string = 'barra';
  timeOffset: number = 0; // Controla el slider de manipulación de tiempo

  updateTime() {
    this.timeService.setOffset(this.timeOffset);
  }

  resetTime() {
    this.timeOffset = 0;
    this.updateTime();
  }
}