import type { Checker } from './checker.ts';
import { isDateTimeBetweenHours } from '../utils.ts';

export class RepositoryChecker implements Checker {
    name: String;
    payload: any;

    constructor(payload: any) {
        this.name = 'RepositoryChecker';
        this.payload = payload;
    }

    check(): boolean {
        if(this.payload?.repository && this.payload.action === 'deleted') {
            const full_name: String = this.payload.repository.full_name;
            if (Date.now() - new Date(this.payload.repository.created_at).getTime() < 10 * 60 * 1000) {
                return false;
            }
        }
        return true;
    }

    getMessage(): String {
        return 'Repository deleted within 10 minutes of creation';
    }
}