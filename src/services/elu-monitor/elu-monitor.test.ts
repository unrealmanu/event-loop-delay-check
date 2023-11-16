import { EventLoopDelayCheckService, IEventLoopCheckService } from '../event-loop-check';
import { IEluMonitorService } from './elu-monitor.interface';
import { EluMonitorService } from './elu-monitor.service';

describe('EluMonitorService', () => {
    let eventLoopMonitor: IEluMonitorService;
    let eventLoopCheckService: IEventLoopCheckService;

    let spiedEventLoopCheckServiceGetLoopUtilizations: jest.SpyInstance;
    let spiedEventLoopCheckServiceGetEventLoopDelay: jest.SpyInstance;

    beforeAll(() => {
        eventLoopCheckService = new EventLoopDelayCheckService();
        eventLoopMonitor = new EluMonitorService(eventLoopCheckService);
    });

    it('should be expect the event loop delay and utilizations is reveled', (done) => {
        spiedEventLoopCheckServiceGetLoopUtilizations = jest.spyOn(eventLoopCheckService, 'getEventLoopUtilizations');
        spiedEventLoopCheckServiceGetEventLoopDelay = jest.spyOn(eventLoopCheckService, 'getEventLoopDelay');

        eventLoopMonitor.create();

        expect(eventLoopMonitor).toBeDefined();
        expect(eventLoopCheckService).toBeDefined();

        setTimeout(() => {
            expect(spiedEventLoopCheckServiceGetLoopUtilizations).toBeCalled();
            expect(spiedEventLoopCheckServiceGetEventLoopDelay).toBeCalled();

            expect(eventLoopMonitor.isCriticalStatus()).toBe(false);
            done();
        }, 1000);
    });

    it("should be expect the event loop delay and utilizations is reveled and it's critical", (done) => {
        spiedEventLoopCheckServiceGetLoopUtilizations = jest.spyOn(eventLoopCheckService, 'getEventLoopUtilizations');
        spiedEventLoopCheckServiceGetEventLoopDelay = jest.spyOn(eventLoopCheckService, 'getEventLoopDelay');

        eventLoopMonitor.create();
        eventLoopMonitor.setConfig({
            criticalThreshold: 0,
            criticalDelayMs: 0,
            checkIntervalMs: 100,
        });

        expect(eventLoopMonitor).toBeDefined();
        expect(eventLoopCheckService).toBeDefined();

        setTimeout(() => {
            expect(spiedEventLoopCheckServiceGetLoopUtilizations).toBeCalled();
            expect(spiedEventLoopCheckServiceGetEventLoopDelay).toBeCalled();

            expect(eventLoopMonitor.isCriticalStatus()).toBe(true);
            done();
        }, 1000);
    });

    afterAll(() => {
        eventLoopMonitor.destroy();
    });
});
