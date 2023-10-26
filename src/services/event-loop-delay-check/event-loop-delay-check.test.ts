import sleep from 'atomic-sleep';
import { EventLoopDelayCheckService } from './event-loop-delay-check.service';
import { IEventLoopDelayCheck } from './event-loop-delay-check.interface';

describe('EventLoopDelayCheck', () => {
    let service: IEventLoopDelayCheck.Service;
    const options = { maxDelay: 500 };
    beforeEach(() => {
        service = new EventLoopDelayCheckService();
    });

    it('should be expect event lopp is not delayed', () => {
        service.start(options);
        const delay = service.getEventLoopDelay();
        expect(delay).toBe(0);
    });

    it('should be expect event lopp is delayed of approx 500ms', (done) => {
        service.start(options);

        sleep(1000);

        setTimeout(() => {
            const delay = service.getEventLoopDelay();
            expect(delay).toBeGreaterThan(options.maxDelay);
            done();
        }, 10);
    });
});
