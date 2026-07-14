import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../../services/time.service';

export type F1SessionState = 'practice' | 'qualifying' | 'race';

function getF1SessionState(date: Date): F1SessionState {
    const h = date.getHours();
    const m = date.getMinutes();
    const totalMinutes = h * 60 + m;

    if (totalMinutes >= 360 && totalMinutes < 840) return 'practice';     // 06:00 - 13:59
    if (totalMinutes >= 840 && totalMinutes < 1080) return 'qualifying';  // 14:00 - 17:59
    return 'race';                                                        // 18:00 - 05:59
}

@Component({
    selector: 'app-f1-visualizer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './f1-visualizer.component.html',
    styleUrls: ['./f1-visualizer.component.css']
})
export class F1VisualizerComponent implements OnInit, OnDestroy {
    private timeService = inject(TimeService);

    sessionState: F1SessionState = 'practice';
    currentTime: Date = new Date();
    private timeSub!: Subscription;

    // Valores simulados que cambian dinámicamente para dar realismo a la telemetría
    speed: number = 0;
    rpm: number = 0;
    drsActive: boolean = false;
    tyreWear: number = 100;

    readonly stateLabels: Record<F1SessionState, string> = {
        practice: 'FREE PRACTICE',
        qualifying: 'QUALIFYING - Q3',
        race: 'GRAND PRIX'
    };

    get stateLabel(): string {
        return this.stateLabels[this.sessionState];
    }

    ngOnInit(): void {
        this.timeSub = this.timeService.currentTime$.subscribe((date: Date) => {
            this.currentTime = date;
            this.sessionState = getF1SessionState(date);
            this.updateTelemetry(date);
        });
    }

    // Simula telemetría viva basándose en los segundos
    private updateTelemetry(date: Date): void {
        const seconds = date.getSeconds();

        if (this.sessionState === 'practice') {
            this.speed = 180 + (seconds % 15) * 8;
            this.rpm = 9500 + (seconds % 15) * 300;
            this.drsActive = seconds % 10 > 7;
            this.tyreWear = Math.max(70, 95 - (seconds % 30) * 0.5);
        } else if (this.sessionState === 'qualifying') {
            this.speed = 290 + (seconds % 10) * 6; // ¡Más rápido en Qualy!
            this.rpm = 12000 + (seconds % 10) * 250;
            this.drsActive = seconds % 6 > 3;
            this.tyreWear = Math.max(85, 99 - (seconds % 20) * 0.8);
        } else { // Race
            this.speed = 260 + (seconds % 12) * 7;
            this.rpm = 11000 + (seconds % 12) * 200;
            this.drsActive = seconds % 12 > 8;
            this.tyreWear = Math.max(30, 80 - (seconds % 60) * 0.9); // Mayor desgaste
        }
    }

    ngOnDestroy(): void {
        if (this.timeSub) {
            this.timeSub.unsubscribe();
        }
    }
}