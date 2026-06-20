import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public authStatus$ = this.isAuthenticated.asObservable();

  constructor() {
    // Verificar si hay sesión activa al recargar
    if (localStorage.getItem('currentUser')) {
      this.isAuthenticated.next(true);
    }
  }

  register(user: string, pass: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user]) return false; // Usuario ya existe
    users[user] = pass;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(user: string, pass: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user] === pass) {
      localStorage.setItem('currentUser', user);
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isAuthenticated.next(false);
  }
}