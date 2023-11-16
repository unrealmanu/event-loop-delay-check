import { IEventLoopUtilizationsService } from '../event-loop-utilizations/event-loop-utilizations.interface';
import { EventLoopUtilizationsService } from '../event-loop-utilizations/event-loop-utilizations.service';
import { IHRTimeService } from '../hr-time-service/hr-time.interface';
import { HRTimeService } from '../hr-time-service/hr-time.service';
import { IEventLoopCheckService, IEventLoopCheckServiceStartOptions } from './event-loop-check.interface';

export class EventLoopDelayCheckService implements IEventLoopCheckService {
    private _lastCheck: number = 0;
    private _eventLoopDelay: number = 0;
    private _checkTimeout: NodeJS.Timeout;
    private _sampleInterval: number = 500;
    private _minDelay: number = 500;

    constructor(
        private _hrTimeService: IHRTimeService = new HRTimeService(),
        private _eventLoopUtilizationsService: IEventLoopUtilizationsService = new EventLoopUtilizationsService(),
    ) {}

    /**
     * @param options.sampleInterval - The sample od interval in milliseconds at which the event loop delay is calculated.
     * @param options.minDelay - The minimum delay in milliseconds before the event loop is considered blocked.
     * @returns void
     */
    public start(options?: IEventLoopCheckServiceStartOptions): void {
        this._lastCheck = this._hrTimeService.getNow();

        const optionsSampleInterval = options?.sampleInterval || 0;
        const optionsMinDelay = options?.minDelay || 0;

        this._sampleInterval = Math.max(optionsSampleInterval, this._sampleInterval);
        this._minDelay = Math.max(optionsMinDelay, this._minDelay);

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
