export interface IEventLoopUtilizationsService {
    start(): void;
    getEventLoopUtilization(): number;
}
