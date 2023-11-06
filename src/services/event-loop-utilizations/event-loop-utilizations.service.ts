import { EventLoopUtilization, performance } from 'node:perf_hooks';
import { IEventLoopUtilizationsService } from './event-loop-utilizations.interface';

export class EventLoopUtilizationsService implements IEventLoopUtilizationsService {
    private _eventLoopUtilized = 0;
    private _elu: EventLoopUtilization = performance.eventLoopUtilization();

    start(): void {
        this._elu = performance.eventLoopUtilization();
    }

    getEventLoopUtilization() {
        this._eventLoopUtilized = performance.eventLoopUtilization(this._elu).utilization;

        const eluPercentage = this._eventLoopUtilized * 100;

        return Math.min(eluPercentage, 100);
    }
}
