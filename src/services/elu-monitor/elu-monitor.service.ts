import { EventLoopDelayCheckService } from '../event-loop-check';
import { IEventLoopCheckService } from '../event-loop-check/event-loop-check.interface';
import { EluMonitorServiceOptions, IEluMonitorService } from './elu-monitor.interface';

export class EluMonitorService implements IEluMonitorService {
    constructor(private _eventLoopDelayCheckService: IEventLoopCheckService = new EventLoopDelayCheckService()) {}
    private _eluInterval: NodeJS.Timeout;
    private _criticalThreshold: number = 90;
    private _checkIntervalMs: number = 100;
    private _statusCheckCallback?: EluMonitorServiceOptions['statusCheckCallback'];
    private _isCriticalStatus = false;

    public setConfig({ criticalThreshold, statusCheckCallback, checkIntervalMs }: EluMonitorServiceOptions) {
        this._criticalThreshold = criticalThreshold ?? this._criticalThreshold;
        this._checkIntervalMs = Math.max(checkIntervalMs ?? this._checkIntervalMs);
        this._statusCheckCallback = statusCheckCallback;
    }

    public create() {
        this._eventLoopDelayCheckService.start();

        this._eluInterval = setInterval(this._checkStatus.bind(this), 500);

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

        const isCritical = eluUtilizations > this._criticalThreshold;
        this._isCriticalStatus = isCritical;

        this?._statusCheckCallback(isCritical, eluUtilizations);
    }
}
