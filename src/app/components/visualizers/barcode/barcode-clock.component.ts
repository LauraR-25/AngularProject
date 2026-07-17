import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barcode-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barcode-clock.component.html',
  styleUrl: './barcode-clock.component.css'
})
export class BarcodeClockComponent implements OnInit, OnDestroy {
  // Porcentajes de llenado para el ancho (width) de las barras (0 a 100%)
  hourProgress: number = 0;
  minuteProgress: number = 0;
  secondProgress: number = 0;

  // Textos para mostrar el número exacto estilo consola
  displayHours: string = '00';
  displayMinutes: string = '00';
  displaySeconds: string = '00';

  private animationFrameId: number | null = null;

  @Input() set currentTime(date: Date | null | undefined) {
    const validDate = date || new Date();
    this.calculateProgress(validDate);
  }

  ngOnInit() {
    this.startScannerLoop();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startScannerLoop() {
    const loop = () => {
      this.calculateProgress(new Date());
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private calculateProgress(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    // Formateo de texto a 2 dígitos (ej. "09", "14")
    this.displayHours = hours.toString().padStart(2, '0');
    this.displayMinutes = minutes.toString().padStart(2, '0');
    this.displaySeconds = seconds.toString().padStart(2, '0');

    // Cálculos con decimales para que el crecimiento de la barra sea continuo (sin saltos)
    const exactSeconds = seconds + milliseconds / 1000;
    const exactMinutes = minutes + exactSeconds / 60;
    // Usamos formato 24 horas para la barra principal
    const exactHours = hours + exactMinutes / 60;

    // Convertir a porcentajes (0% al 100%)
    this.secondProgress = (exactSeconds / 60) * 100;
    this.minuteProgress = (exactMinutes / 60) * 100;
    this.hourProgress = (exactHours / 24) * 100;
  }
}