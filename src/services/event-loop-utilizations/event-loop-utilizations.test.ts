import { spawnSync } from 'node:child_process';
import { IEventLoopUtilizationsService } from './event-loop-utilizations.interface';
import { EventLoopUtilizationsService } from './event-loop-utilizations.service';

describe('EventLoopUtilizationsService', () => {
    const eventLoopUtilizationService: IEventLoopUtilizationsService = new EventLoopUtilizationsService();

    beforeEach(() => {
        eventLoopUtilizationService.start();
    });

    it('should return a number', () => {
        const typeOfEventLoopUtilization = typeof eventLoopUtilizationService.getEventLoopUtilization();

        expect(typeOfEventLoopUtilization).toBe('number');
    });

    describe('when the event loop is loaded', () => {
        it('should be return exactly 100% utilization of event loop', () => {
            const expectedEluPercentage = 100;

            spawnSync('sleep', ['1']);
            const eventLoopUsed = eventLoopUtilizationService.getEventLoopUtilization();

            expect(eventLoopUsed).toBe(expectedEluPercentage);
        });
    });

    describe('when the event loop is unused', () => {
        it('should be return under 50% utilization of event loop', (done) => {
            const expectedEluPercentage = 50;

            setTimeout(() => {
                const eventLoopUsed = eventLoopUtilizationService.getEventLoopUtilization();
                expect(eventLoopUsed).toBeLessThan(expectedEluPercentage);
                done();
            }, 1000);
        });
    });
});
