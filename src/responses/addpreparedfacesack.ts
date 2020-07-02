import { Response } from './response';

// ans_type = 207
export class AddPreparedFacesAck extends Response {
    public isSucceeded(): boolean {
        return this.resultCode === 2;
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }
}
