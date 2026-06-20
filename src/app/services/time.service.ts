import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private offsetMs = new BehaviorSubject<number>(0); // Desfase en milisegundos

  // Observable que emite la fecha modificada cada segundo
  public currentTime$: Observable<Date> = interval(1000).pipe(
    map(() => new Date(Date.now() + this.offsetMs.value))
  );

  // Actualiza el desfase desde el slider (recibe horas y las pasa a ms)
  setOffset(hoursOffset: number) {
    this.offsetMs.next(hoursOffset * 60 * 60 * 1000);
  }
}