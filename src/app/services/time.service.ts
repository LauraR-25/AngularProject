import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimeService {

  private _offsetHours = 0;
  private _offsetMinutes = 0;
  private _offsetSeconds = 0;
  private _speed = 1;
  private _paused = false;

  private _baseTime = Date.now();
  private _lastTickRealTime = Date.now();
  private _tickHandle: any = null;

  private readonly _currentTime$ = new BehaviorSubject<Date>(new Date());
  public readonly currentTime$: Observable<Date> = this._currentTime$.asObservable();

  constructor() {
    this.startTicking();
  }

  // ─────────── Offset ───────────

  get offsetHours(): number { return this._offsetHours; }
  get offsetMinutes(): number { return this._offsetMinutes; }
  get offsetSeconds(): number { return this._offsetSeconds; }

  get totalOffsetMs(): number {
    return (this._offsetHours * 3600 + this._offsetMinutes * 60 + this._offsetSeconds) * 1000;
  }

  setOffset(hours: number, minutes: number, seconds: number): void {
    this._offsetHours = hours;
    this._offsetMinutes = minutes;
    this._offsetSeconds = seconds;
  }

  // ─────────── Speed ───────────

  get speed(): number { return this._speed; }

  setSpeed(multiplier: number): void {
    this._speed = multiplier;
    this.recalibrate();
    this.startTicking();
  }

  // ─────────── Pause ───────────

  get paused(): boolean { return this._paused; }

  pause(): void {
    this._paused = true;
  }

  resume(): void {
    if (!this._paused) return;
    this._paused = false;
    this.recalibrate();
  }

  // ─────────── Reset ───────────

  resetAll(): void {
    this._offsetHours = 0;
    this._offsetMinutes = 0;
    this._offsetSeconds = 0;
    this._speed = 1;
    this._paused = false;
    this._baseTime = Date.now();
    this._lastTickRealTime = Date.now();
    this._currentTime$.next(new Date());
    this.startTicking();
  }

  // ─────────── Internals ───────────

  private recalibrate(): void {
    this._baseTime = this._currentTime$.getValue().getTime() - this.totalOffsetMs;
    this._lastTickRealTime = Date.now();
  }

  private startTicking(): void {
    if (this._tickHandle !== null) {
      clearInterval(this._tickHandle);
    }
    const tickMs = Math.max(50, Math.round(1000 / this._speed));
    this._tickHandle = setInterval(() => this.tick(), tickMs);
  }

  private tick(): void {
    if (this._paused) return;

    const now = Date.now();
    const elapsed = now - this._lastTickRealTime;
    this._baseTime += elapsed * this._speed;
    this._lastTickRealTime = now;

    this._currentTime$.next(new Date(this._baseTime + this.totalOffsetMs));
  }
}
