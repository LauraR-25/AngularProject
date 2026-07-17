import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mechanical-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mechanical-clock.component.html',
  styleUrl: './mechanical-clock.component.css'
})
export class MechanicalClockComponent implements OnInit, OnDestroy {
  // Grados de rotación para las manecillas
  hourDegrees: number = 0;
  minuteDegrees: number = 0;
  secondDegrees: number = 0;

  // Grados de rotación para los engranajes mecánicos internos (Estilo Skeleton)
  fastGearDegrees: number = 0;
  mediumGearDegrees: number = 0;
  slowGearDegrees: number = 0;

  private animationFrameId: number | null = null;

  // Control seguro del Input para evitar el error de tipado estricto (Date | null)
  @Input() set currentTime(date: Date | null | undefined) {
    const validDate = date || new Date();
    this.calculatePositions(validDate);
  }

  ngOnInit() {
    // Inicializa el bucle de renderizado continuo a 60 FPS
    this.startClockLoop();
  }

  ngOnDestroy() {
    // Limpia el frame de animación al destruir el componente para evitar fugas de memoria
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startClockLoop() {
    const loop = () => {
      this.calculatePositions(new Date());
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private calculatePositions(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    // Transformación matemática a tiempo continuo decimal (Agujas fluidas tipo cronógrafo)
    const exactSeconds = seconds + milliseconds / 1000;
    const exactMinutes = minutes + exactSeconds / 60;
    const exactHours = hours + exactMinutes / 60;

    // Cálculo exacto de los ángulos (360 grados de la circunferencia)
    this.secondDegrees = exactSeconds * 6;       // 360 / 60 segundos
    this.minuteDegrees = exactMinutes * 6;       // 360 / 60 minutos
    this.hourDegrees = exactHours * 30;          // 360 / 12 horas

    // Movimiento sutil de la maquinaria interna de engranajes
    this.fastGearDegrees = exactSeconds * 15;
    this.mediumGearDegrees = -(exactMinutes * 10); // Gira a la inversa por acoplamiento físico
    this.slowGearDegrees = exactHours * 8;
  }
}