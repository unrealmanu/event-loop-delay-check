export type StatusCheckCallback = (isCritical: boolean, eluUtilization: number) => void;

export type EluMonitorServiceOptions = {
    checkIntervalMs?: number;
    criticalThreshold?: number;
    criticalDelayMs: number;
    statusCheckCallback?: StatusCheckCallback;
};

export interface IEluMonitorService {
    create(): void;
    destroy(): void;
    setConfig(options: EluMonitorServiceOptions): void;
    setStatuCheckCallback(statusCheckCallback: StatusCheckCallback);
    isCriticalStatus(): boolean;
}
