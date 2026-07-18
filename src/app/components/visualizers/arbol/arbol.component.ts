import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { obtenerInfoFechaYEstacion, InfoFecha } from '../../../services/date-station.utils';

@Component({
  selector: 'app-arbol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arbol.component.html',
  styleUrl: './arbol.component.css'
})
export class ArbolComponent {
  infoSimulada?: InfoFecha;
  horaSimulada: Date = new Date();

  manualMode = false;
  manualDate: Date = new Date();

  private get effectiveDate(): Date {
    return this.manualMode ? this.manualDate : this.horaSimulada;
  }

  private recalc(): void {
    this.infoSimulada = obtenerInfoFechaYEstacion(this.effectiveDate);
  }

  @Input() set currentTime(date: Date | null | undefined) {
    if (date) {
      this.horaSimulada = date;
      if (!this.manualMode) {
        this.recalc();
      }
    }
  }

  get manualDia(): string {
    return this.manualDate.getDate().toString().padStart(2, '0');
  }

  get manualMesNombre(): string {
    const meses = [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
    ];
    return meses[this.manualDate.getMonth()];
  }

  get manualAnio(): number {
    return this.manualDate.getFullYear();
  }

  toggleManualMode(): void {
    this.manualMode = !this.manualMode;
    if (this.manualMode) {
      this.manualDate = new Date(this.horaSimulada);
    }
    this.recalc();
  }

  changeMonth(delta: number): void {
    const d = new Date(this.manualDate);
    d.setMonth(d.getMonth() + delta);
    this.manualDate = d;
    this.recalc();
  }

  changeYear(delta: number): void {
    const d = new Date(this.manualDate);
    d.setFullYear(d.getFullYear() + delta);
    this.manualDate = d;
    this.recalc();
  }

  changeDay(delta: number): void {
    const d = new Date(this.manualDate);
    d.setDate(d.getDate() + delta);
    this.manualDate = d;
    this.recalc();
  }

  onDateInput(value: string): void {
    if (value) {
      this.manualDate = new Date(value + 'T12:00:00');
      this.recalc();
    }
  }

  get dateInputValue(): string {
    const y = this.manualDate.getFullYear();
    const m = (this.manualDate.getMonth() + 1).toString().padStart(2, '0');
    const d = this.manualDate.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
