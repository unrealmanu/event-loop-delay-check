import { IEventLoopUtilizationsService } from '../event-loop-utilizations/event-loop-utilizations.interface';
import { EventLoopUtilizationsService } from '../event-loop-utilizations/event-loop-utilizations.service';
import { IHRTimeService } from '../hr-time-service/hr-time.interface';
import { HRTimeService } from '../hr-time-service/hr-time.service';
import { IEventLoopCheck } from './event-loop-check.interface';

export class EventLoopDelayCheckService implements IEventLoopCheck.Service {
    private _lastCheck: number = 0;
    private _eventLoopDelay: number = 0;
    private _checkTimeout: NodeJS.Timeout;
    private _sampleInterval: number = 1000;
    private _minDelay: number = 1000;

    constructor(
        private _hrTimeService: IHRTimeService = new HRTimeService(),
        private _eventLoopUtilizationsService: IEventLoopUtilizationsService = new EventLoopUtilizationsService(),
    ) {}

    public start({ minDelay, sampleInterval }: IEventLoopCheck.StartOptions): void {
        this._lastCheck = this._hrTimeService.getNow();
        this._sampleInterval = sampleInterval ?? this._sampleInterval;
        this._minDelay = minDelay ?? this._minDelay;
        this._eventLoopUtilizationsService.start();

        this._newCheckTimeout();
    }

    public stop(): void {
        clearTimeout(this._checkTimeout);
    }

    public getEventLoopDelay(): number {
        return this._eventLoopDelay;
    }

    public getEventLoopUtilizations(): number {
        return this._eventLoopUtilizationsService.getEventLoopUtilization();
    }

    private _checkEventLoopDelay(this: EventLoopDelayCheckService) {
        const now = this._hrTimeService.getNow();

        const eventLoopDelay = now - this._lastCheck - this._minDelay;
        this._eventLoopDelay = Math.max(0, eventLoopDelay);
        this._eventLoopUtilizationsService.getEventLoopUtilization();

        this._newCheckTimeout();
        this._lastCheck = now;
    }

    private _newCheckTimeout() {
        clearTimeout(this._checkTimeout);

        const checkEventLoop = this._checkEventLoopDelay.bind(this);
        this._checkTimeout = setTimeout(checkEventLoop, this._sampleInterval);
        this._checkTimeout.unref();
    }
}
