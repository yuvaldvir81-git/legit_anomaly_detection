import type { Checker } from './checker.ts';
import { isDateTimeBetweenHours } from '../utils.ts';

export class PushChecker implements Checker {
    name: String;
    payload: any;

    constructor(payload: any) {
        this.name = 'PushChecker';
        this.payload = payload;
    }

    check(): boolean {
        try {
            if(this.payload?.head_commit) {
                const timestamp: Date = new Date(this.payload.head_commit.timestamp);
                if (isDateTimeBetweenHours(timestamp, 14, 0, 16, 0)) {
                    return false;
                }
            }
        }
        catch (error) {
            return true; // Fail open on error
        }
        return true;
    }

    getMessage(): String {
        return 'pushing code between 14:00-16:00';
    }
}