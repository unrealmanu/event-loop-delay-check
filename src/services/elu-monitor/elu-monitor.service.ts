import { EventLoopDelayCheckService } from '../event-loop-check';
import { IEventLoopCheckService } from '../event-loop-check/event-loop-check.interface';
import { EluMonitorServiceOptions, IEluMonitorService, StatusCheckCallback } from './elu-monitor.interface';

export class EluMonitorService implements IEluMonitorService {
    constructor(private _eventLoopDelayCheckService: IEventLoopCheckService = new EventLoopDelayCheckService()) {}
    private _eluInterval: NodeJS.Timeout;
    private _criticalThreshold: number = 90;
    private _criticalDelayMs: number = 5000;
    private _checkIntervalMs: number = 100;

    private _statusCheckCallback?: EluMonitorServiceOptions['statusCheckCallback'];
    private _isCriticalStatus = false;

    public setConfig({
        criticalThreshold,
        statusCheckCallback,
        checkIntervalMs,
        criticalDelayMs,
    }: EluMonitorServiceOptions) {
        this._criticalThreshold = criticalThreshold ?? this._criticalThreshold;
        this._criticalDelayMs = criticalDelayMs ?? this._criticalDelayMs;

        this._checkIntervalMsIsLow(checkIntervalMs);
        this._checkIntervalMs = Math.max(checkIntervalMs ?? this._checkIntervalMs);

        this._statusCheckCallback = statusCheckCallback;
    }

    public setStatusCheckCallback(statusCheckCallback: StatusCheckCallback) {
        this._statusCheckCallback = statusCheckCallback;
    }

    public create() {
        this._eventLoopDelayCheckService.start();

        this._eluInterval = setInterval(this._checkStatus.bind(this), this._checkIntervalMs);

        this._eluInterval.unref();
    }

    public destroy(): void {
        clearInterval(this._eluInterval);
        this._eventLoopDelayCheckService.stop();
    }

    public isCriticalStatus(): boolean {
        return this._isCriticalStatus;
    }

    private _checkStatus(this: EluMonitorService) {
        const eluUtilizations = this._eventLoopDelayCheckService.getEventLoopUtilizations();
        const eluDelay = this._eventLoopDelayCheckService.getEventLoopDelay();

        const isCriticalThreshold = eluUtilizations > this._criticalThreshold;
        const isCriticalDelay = eluDelay > this._criticalDelayMs;

        this._isCriticalStatus = isCriticalThreshold && isCriticalDelay;

        if (typeof this?._statusCheckCallback === 'function') {
            this._statusCheckCallback(isCriticalThreshold, eluUtilizations);
        }
    }

    private _checkIntervalMsIsLow(checkIntervalMs: number) {
        if (checkIntervalMs < this._checkIntervalMs) {
            console.warn(`checkIntervalMs is too low, the minimum accepted is ${this._checkIntervalMs}ms`);
        }
    }
}
