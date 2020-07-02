import { Response } from './response';

// ans_type = 192
export class QuerySectorAck extends Response {
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
