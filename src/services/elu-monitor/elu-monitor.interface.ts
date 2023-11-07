export type EluMonitorServiceOptions = {
    checkIntervalMs?: number;
    criticalThreshold?: number;
    statusCheckCallback?: (isCritical: boolean, eluUtilization: number) => void;
};

export interface IEluMonitorService {
    setConfig(options: EluMonitorServiceOptions): void;
    create(): void;
    destroy(): void;
    isCriticalStatus(): boolean;
}
