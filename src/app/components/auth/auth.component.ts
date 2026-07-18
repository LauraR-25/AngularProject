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

      <div class="auth-card">
        <!-- Cabecera -->
        <div class="brand">
          <h1 class="brand-title">Visualizador de tiempo</h1>
          <p class="brand-sub">{{ isLoginMode ? 'ACCESO AL SISTEMA' : 'REGISTRO DE USUARIO' }}</p>
        </div>

        <!-- Divisor -->
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-icon">&#9670;</span>
          <span class="divider-line"></span>
        </div>

        <!-- Formulario -->
        <form class="auth-form" (ngSubmit)="submit()">

          <!-- Usuario: SIEMPRE visible -->
          <div class="field-group">
            <label class="field-label">USUARIO</label>
            <div class="input-wrapper">
              <span class="input-icon">&#9654;</span>
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

          <!-- Contraseña: SIEMPRE visible -->
          <div class="field-group">
            <label class="field-label">CONTRASEÑA</label>
            <div class="input-wrapper">
              <span class="input-icon">&#128274;</span>
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

          <!-- Confirmar contraseña: SOLO en modo registro -->
          @if (!isLoginMode) {
            <div class="field-group confirm-field">
              <label class="field-label">CONFIRMAR CONTRASEÑA</label>
              <div class="input-wrapper">
                <span class="input-icon">&#128274;</span>
                <input
                  id="auth-confirm-password"
                  class="field-input"
                  type="password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  autocomplete="new-password"
                  required
                />
              </div>
            </div>
          }

          <!-- Mensaje de error/éxito -->
          @if (statusMessage) {
            <div class="msg-box" [class.msg-success]="isSuccess">
              <span class="msg-icon">{{ isSuccess ? '&#10004;' : '&#10008;' }}</span>
              {{ statusMessage }}
            </div>
          }

          <!-- Botón principal -->
          <button id="auth-submit-btn" type="submit" class="btn-primary">
            <span class="btn-glow"></span>
            {{ isLoginMode ? '[ INICIAR SESIÓN ]' : '[ REGISTRARSE ]' }}
          </button>
        </form>

        <!-- Toggle Login / Register -->
        <div class="toggle-section">
          <span class="toggle-text">
            {{ isLoginMode ? '¿Sin cuenta aún?' : '¿Ya tienes cuenta?' }}
          </span>
          <button
            id="auth-toggle-btn"
            class="btn-toggle"
            type="button"
            (click)="toggleMode()"
          >
            {{ isLoginMode ? 'Crear cuenta' : 'Iniciar sesión' }}
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
    .brand-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.45rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #ffffff;
      margin: 0 0 8px 0;
      text-shadow: 0 0 20px rgba(230, 57, 70, 0.4), 0 0 40px rgba(230, 57, 70, 0.15);
    }
    .brand-sub {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      font-weight: 400;
      letter-spacing: 0.35em;
      color: #ffd60a;
      margin: 0;
      opacity: 0.9;
      transition: opacity 0.3s ease;
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
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
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

    /* Campo Confirmar Contraseña: animación de entrada */
    .confirm-field {
      animation: fieldSlideIn 0.35s ease forwards;
    }
    @keyframes fieldSlideIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

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
  private authService = inject(AuthService);

  isLoginMode = true;
  username = '';
  password = '';
  confirmPassword = '';
  statusMessage = '';
  isSuccess = false;

  particles = Array.from({ length: 18 }, () => {
    const size = Math.random() * 4 + 2;
    const colors = ['#e63946', '#ffd60a', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `left:${Math.random() * 100}%;width:${size}px;height:${size}px;background:${color};animation-duration:${Math.random() * 15 + 10}s;animation-delay:${Math.random() * -20}s;`;
  });

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearMessages();
    this.confirmPassword = '';
  }

  submit(): void {
    this.clearMessages();

    if (this.isLoginMode) {
      this.doLogin();
    } else {
      this.doRegister();
    }
  }

  private doLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      return;
    }
    this.statusMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
    this.isSuccess = false;
  }

  private doRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.statusMessage = 'Las contraseñas no coinciden.';
      this.isSuccess = false;
      return;
    }

    if (!this.authService.register(this.username, this.password)) {
      this.statusMessage = 'Ese nombre de usuario ya existe.';
      this.isSuccess = false;
      return;
    }

    this.statusMessage = 'Registro exitoso. Redirigiendo al inicio de sesión...';
    this.isSuccess = true;

    setTimeout(() => {
      this.isLoginMode = true;
      this.clearMessages();
      this.password = '';
      this.confirmPassword = '';
    }, 1800);
  }

  private clearMessages(): void {
    this.statusMessage = '';
    this.isSuccess = false;
  }
}
