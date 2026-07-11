import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="auth-bg">
      <div class="scanline"></div>

      <div class="auth-card" [class.register-mode]="!isLogin">
        <!-- Logo / Título -->
        <div class="brand">
          <div class="brand-icon">{{ isLogin ? '☀️' : '🌕' }}</div>
          <h1 class="brand-title">CELESTIAL</h1>
          <p class="brand-sub">{{ isLogin ? 'ACCESO AL SISTEMA' : 'CREAR CUENTA' }}</p>
        </div>

        <!-- Divisor -->
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-icon">◆</span>
          <span class="divider-line"></span>
        </div>

        <!-- Formulario -->
        <form class="auth-form" (ngSubmit)="submit()">
          <div class="field-group">
            <label class="field-label">USUARIO</label>
            <div class="input-wrapper">
              <span class="input-icon">▶</span>
              <input
                id="auth-username"
                class="field-input"
                [(ngModel)]="username"
                name="username"
                placeholder="Introduce tu nombre de usuario"
                autocomplete="username"
                required
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">CONTRASEÑA</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                id="auth-password"
                class="field-input"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Introduce tu contraseña"
                autocomplete="current-password"
                required
              />
            </div>
          </div>

          <!-- Mensaje de error/éxito -->
          @if (errorMsg) {
            <div class="msg-box" [class.msg-success]="isSuccessMsg">
              <span class="msg-icon">{{ isSuccessMsg ? '✔' : '✘' }}</span>
              {{ errorMsg }}
            </div>
          }

          <!-- Botón principal -->
          <button id="auth-submit-btn" type="submit" class="btn-primary">
            <span class="btn-glow"></span>
            {{ isLogin ? '[ INICIAR SESIÓN ]' : '[ REGISTRARSE ]' }}
          </button>
        </form>

        <!-- Toggle Login / Register -->
        <div class="toggle-section">
          <span class="toggle-text">
            {{ isLogin ? '¿Sin cuenta aún?' : '¿Ya eres miembro?' }}
          </span>
          <button id="auth-toggle-btn" class="btn-toggle" type="button" (click)="switchMode()">
            {{ isLogin ? 'Crear cuenta →' : '← Iniciar sesión' }}
          </button>
        </div>

        <!-- Decoración de esquinas -->
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
      </div>

      <!-- Partículas decorativas -->
      <div class="particles">
        @for (p of particles; track $index) {
          <div class="particle" [style]="p"></div>
        }
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');

    /* ===== FONDO ===== */
    .auth-bg {
      min-height: 100vh;
      background: radial-gradient(ellipse at 20% 50%, #1a0000 0%, #0a0a0a 40%, #000510 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* Efecto scanlines */
    .scanline {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.08) 2px,
        rgba(0, 0, 0, 0.08) 4px
      );
      pointer-events: none;
      z-index: 0;
    }

    /* ===== PARTÍCULAS ===== */
    .particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .particle {
      position: absolute;
      border-radius: 50%;
      animation: floatUp linear infinite;
      opacity: 0.4;
    }
    @keyframes floatUp {
      from { transform: translateY(110vh) scale(0); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.3; }
      to { transform: translateY(-10vh) scale(1); opacity: 0; }
    }

    /* ===== TARJETA PRINCIPAL ===== */
    .auth-card {
      position: relative;
      z-index: 10;
      background: linear-gradient(145deg, #141414 0%, #0d0d0d 100%);
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      padding: 48px 44px;
      width: 100%;
      max-width: 420px;
      box-shadow:
        0 0 0 1px rgba(230, 57, 70, 0.1),
        0 20px 60px rgba(0, 0, 0, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.03);
      transition: box-shadow 0.4s ease;
    }
    .auth-card:hover {
      box-shadow:
        0 0 0 1px rgba(230, 57, 70, 0.2),
        0 0 40px rgba(230, 57, 70, 0.05),
        0 20px 60px rgba(0, 0, 0, 0.9),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    /* ===== DECORACIÓN DE ESQUINAS ===== */
    .corner {
      position: absolute;
      width: 16px;
      height: 16px;
      border-color: #e63946;
      border-style: solid;
    }
    .corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
    .corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
    .corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
    .corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

    /* ===== BRAND / LOGO ===== */
    .brand { text-align: center; margin-bottom: 28px; }
    .brand-icon {
      font-size: 2.8rem;
      animation: pulse 3s ease-in-out infinite;
      display: block;
      margin-bottom: 12px;
    }
    @keyframes pulse {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 214, 10, 0.6)); transform: scale(1); }
      50% { filter: drop-shadow(0 0 20px rgba(255, 214, 10, 0.9)); transform: scale(1.05); }
    }
    .brand-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      letter-spacing: 0.25em;
      color: #ffffff;
      margin: 0 0 6px 0;
      text-shadow: 0 0 20px rgba(230, 57, 70, 0.5), 0 0 40px rgba(230, 57, 70, 0.2);
    }
    .brand-sub {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 400;
      letter-spacing: 0.35em;
      color: #ffd60a;
      margin: 0;
      opacity: 0.9;
    }

    /* ===== DIVISOR ===== */
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
    }
    .divider-icon {
      color: #e63946;
      font-size: 0.6rem;
      opacity: 0.7;
    }

    /* ===== FORMULARIO ===== */
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 7px; }
    .field-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #666;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      font-size: 0.7rem;
      color: #444;
      pointer-events: none;
      transition: color 0.3s;
    }
    .field-input {
      width: 100%;
      background: #0d0d0d;
      border: 1px solid #2a2a2a;
      border-radius: 3px;
      padding: 13px 14px 13px 36px;
      color: #e8e8e8;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
      box-sizing: border-box;
    }
    .field-input::placeholder { color: #333; }
    .field-input:focus {
      border-color: #e63946;
      box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.12), inset 0 0 10px rgba(230, 57, 70, 0.04);
    }
    .field-input:focus + .input-icon,
    .input-wrapper:focus-within .input-icon { color: #e63946; }

    /* ===== MENSAJES ===== */
    .msg-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(230, 57, 70, 0.08);
      border: 1px solid rgba(230, 57, 70, 0.3);
      border-radius: 3px;
      padding: 10px 14px;
      color: #e63946;
      font-size: 0.82rem;
      animation: slideIn 0.3s ease;
    }
    .msg-box.msg-success {
      background: rgba(255, 214, 10, 0.06);
      border-color: rgba(255, 214, 10, 0.3);
      color: #ffd60a;
    }
    .msg-icon { font-size: 0.9rem; flex-shrink: 0; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ===== BOTÓN PRINCIPAL ===== */
    .btn-primary {
      position: relative;
      width: 100%;
      background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
      color: #ffffff;
      border: none;
      border-radius: 3px;
      padding: 15px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.15s, box-shadow 0.3s;
      margin-top: 4px;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(230, 57, 70, 0.4), 0 0 0 1px rgba(230, 57, 70, 0.5);
    }
    .btn-primary:active { transform: translateY(0); }
    .btn-glow {
      position: absolute;
      top: 0; left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      animation: shimmer 2.5s infinite;
    }
    @keyframes shimmer {
      from { left: -100%; }
      to { left: 200%; }
    }

    /* ===== TOGGLE LOGIN/REGISTER ===== */
    .toggle-section {
      margin-top: 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .toggle-text {
      color: #444;
      font-size: 0.8rem;
    }
    .btn-toggle {
      background: none;
      border: none;
      color: #ffd60a;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      cursor: pointer;
      padding: 0;
      opacity: 0.85;
      transition: opacity 0.2s, text-shadow 0.2s;
    }
    .btn-toggle:hover {
      opacity: 1;
      text-shadow: 0 0 12px rgba(255, 214, 10, 0.7);
    }
  `]
})
export class AuthComponent {
  authService = inject(AuthService);
  isLogin = true;
  username = '';
  password = '';
  errorMsg = '';
  isSuccessMsg = false;

  // Partículas flotantes decorativas
  particles = Array.from({ length: 18 }, (_, i) => {
    const size = Math.random() * 4 + 2;
    const colors = ['#e63946', '#ffd60a', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * -20}s;
    `;
  });

  switchMode() {
    this.isLogin = !this.isLogin;
    this.errorMsg = '';
    this.username = '';
    this.password = '';
  }

  submit() {
    this.errorMsg = '';
    this.isSuccessMsg = false;

    if (this.isLogin) {
      if (!this.authService.login(this.username, this.password)) {
        this.errorMsg = 'Credenciales incorrectas. Inténtalo de nuevo.';
      }
    } else {
      if (this.authService.register(this.username, this.password)) {
        this.isSuccessMsg = true;
        this.errorMsg = 'Registro exitoso. Ahora inicia sesión.';
        this.isLogin = true;
        this.username = '';
        this.password = '';
      } else {
        this.errorMsg = 'Ese nombre de usuario ya existe.';
      }
    }
  }
}