import { Response } from './response';

// ans_type = 204
export class PrepareAddAck extends Response {
    public isAccepted(): boolean {
        return this.resultCode === 1;
    }

    public isPending(): boolean {
        return this.resultCode === 2;
    }

    public isSucceeded(): boolean {
        return this.isAccepted();
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }
}
