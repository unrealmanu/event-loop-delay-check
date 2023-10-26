import { IHRTimeService } from './hr-time.interface';

export class HRTimeService implements IHRTimeService {
    private _thousand: number = 1e3;
    private _million: number = 1e6;
    public getNow(): number {
        const timeStamp: [number, number] = process.hrtime();
        return timeStamp[0] * this._thousand + timeStamp[1] / this._million;
    }
}
