import { Response } from './response';

// ans_type = 200
export class QuerySectorStatsAck extends Response {
    public isAccepted(): boolean {
        return this.resultCode === 1;
    }

    public isSucceeded(): boolean {
        return this.isAccepted();
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }
}
