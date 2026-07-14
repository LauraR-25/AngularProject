import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../../services/time.service';
import { TimeSimulatorService } from '../../../services/time-simulator.service';

export type SkyPhase = 'dia' | 'atardecer' | 'noche';

function getSkyPhase(date: Date): SkyPhase {
    const h = date.getHours();
    const m = date.getMinutes();
    const totalMinutes = h * 60 + m;

    if (totalMinutes >= 360 && totalMinutes < 1080) return 'dia';
    if (totalMinutes >= 1080 && totalMinutes <= 1190) return 'atardecer';
    return 'noche';
}

@Component({
  selector: 'app-mlp-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mlp-visualizer.component.html',
  styleUrls: ['./mlp-visualizer.component.css']
})
export class MlpVisualizerComponent implements OnInit, OnDestroy {
    private timeService = inject(TimeService);
    private simulator = inject(TimeSimulatorService);

    phase: SkyPhase = 'dia';
    skyGradient: string = '';
    currentTime: Date = new Date();
    private timeSub!: Subscription;

    readonly phaseLabels: Record<SkyPhase, string> = {
        dia: '☀ Día',
        atardecer: '🌅 Atardecer',
        noche: '🌙 Noche'
    };

    get phaseLabel(): string {
        return this.phaseLabels[this.phase];
    }

    ngOnInit(): void {
        this.timeSub = this.timeService.currentTime$.subscribe((date: Date) => {
            this.currentTime = date;
            this.phase = getSkyPhase(date);

            const state = this.simulator.compute(date);
            // Tipado seguro para la asignación del CSS
            this.skyGradient = state.skyGradient as string;
        });
    }

    ngOnDestroy(): void {
        if (this.timeSub) {
            this.timeSub.unsubscribe();
        }
    }
}