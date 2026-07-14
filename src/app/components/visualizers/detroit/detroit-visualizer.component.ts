import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../../services/time.service';
import { TimeSimulatorService } from '../../../services/time-simulator.service';

// Definimos los niveles de inestabilidad en lugar de fases del día
export type SystemState = 'estable' | 'advertencia' | 'desviado';

function getSystemState(date: Date): SystemState {
    const h = date.getHours();
    const m = date.getMinutes();
    const totalMinutes = h * 60 + m;

    if (totalMinutes < 720) return 'estable';       // 00:00 - 11:59
    if (totalMinutes >= 720 && totalMinutes < 1080) return 'advertencia'; // 12:00 - 17:59
    return 'desviado';                              // 18:00 - 23:59
}

@Component({
    selector: 'app-detroit-visualizer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './detroit-visualizer.component.html',
    styleUrls: ['./detroit-visualizer.component.css']
})
export class DetroitVisualizerComponent implements OnInit, OnDestroy {
    private timeService = inject(TimeService);
    private simulator = inject(TimeSimulatorService);

    systemState: SystemState = 'estable';
    currentTime: Date = new Date();
    private timeSub!: Subscription;

    // Etiquetas técnicas para el HUD de CyberLife
    readonly stateLabels: Record<SystemState, string> = {
        estable: 'SYSTEM NOMINAL',
        advertencia: 'ELEVATED STRESS',
        desviado: 'SYSTEM FAILURE'
    };

    get stateLabel(): string {
        return this.stateLabels[this.systemState];
    }

    ngOnInit(): void {
        this.timeSub = this.timeService.currentTime$.subscribe((date: Date) => {
            this.currentTime = date;
            this.systemState = getSystemState(date);
        });
    }

    ngOnDestroy(): void {
        if (this.timeSub) {
            this.timeSub.unsubscribe();
        }
    }
}