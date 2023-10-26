import { IHRTimeService } from '../hr-time-service/hr-time.interface';
import { HRTimeService } from '../hr-time-service/hr-time.service';
import { IEventLoopDelayCheck } from './event-loop-delay-check.interface';

export class EventLoopDelayCheckService implements IEventLoopDelayCheck.Service {
    private _lastCheck: number = 0;
    private _eventLoopDelay: number = 0;
    private _checkTimeout: NodeJS.Timeout;
    private _sampleInterval: number = 1000;

    constructor(private _hrTimeService: IHRTimeService = new HRTimeService()) {}

    public start({ maxDelay }: IEventLoopDelayCheck.StartOptions): void {
        this._lastCheck = this._hrTimeService.getNow();
        this._sampleInterval = maxDelay ?? this._sampleInterval;

        this._newCheckTimeout();
    }

    public stop(): void {
        clearTimeout(this._checkTimeout);
    }

    public getEventLoopDelay(): number {
        return this._eventLoopDelay;
    }

    private _checkEventLoopDelay(this: EventLoopDelayCheckService) {
        const now = this._hrTimeService.getNow();

        const eventLoopDelay = now - this._lastCheck - this._sampleInterval;
        this._eventLoopDelay = Math.max(0, eventLoopDelay);

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
