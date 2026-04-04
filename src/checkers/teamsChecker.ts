import type { Checker } from './checker.ts';
import { isDateTimeBetweenHours } from '../utils.ts';

export class TeamsChecker implements Checker {
    name: String;
    payload: any;

    constructor(payload: any) {
        this.name = 'TeamsChecker';
        this.payload = payload;
    }

    check(): boolean {
        try {
            if(this.payload?.team && this.payload.action === 'created') {
                const name: String = this.payload.team.name;
                if (name.toLowerCase().includes('hacker')) {
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
        return 'A hacker team was created';
    }
}