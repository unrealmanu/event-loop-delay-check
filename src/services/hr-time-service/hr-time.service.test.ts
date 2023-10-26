import { IHRTimeService } from './hr-time.interface';
import { HRTimeService } from './hr-time.service';

describe('HRTimeService', () => {
    let service: IHRTimeService;
    beforeEach(() => {
        service = new HRTimeService();
    });

    it('should be expect actual hrtime normalized', () => {
        const now = service.getNow();
        expect(now).toBeGreaterThan(0);
    });
});
