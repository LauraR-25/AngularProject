import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="auth-container">
      <h2>{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h2>
      <input [(ngModel)]="username" placeholder="Usuario" />
      <input type="password" [(ngModel)]="password" placeholder="Contraseña" />
      
      <button (click)="submit()">{{ isLogin ? 'Entrar' : 'Registrar' }}</button>
      <button class="link" (click)="isLogin = !isLogin">
        {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
      </button>
      <p style="color: red">{{ errorMsg }}</p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 300px; margin: 50px auto; display: flex; flex-direction: column; gap: 10px; }
    input, button { padding: 10px; }
    .link { background: none; border: none; color: blue; cursor: pointer; text-decoration: underline; }
  `]
})
export class AuthComponent {
  authService = inject(AuthService);
  isLogin = true;
  username = '';
  password = '';
  errorMsg = '';

  submit() {
    this.errorMsg = '';
    if (this.isLogin) {
      if (!this.authService.login(this.username, this.password)) this.errorMsg = 'Credenciales incorrectas';
    } else {
      if (this.authService.register(this.username, this.password)) {
        this.isLogin = true;
        this.errorMsg = 'Registro exitoso, ahora inicia sesión.';
      } else {
        this.errorMsg = 'El usuario ya existe.';
      }
    }
  }
}