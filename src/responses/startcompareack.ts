import { Response } from './response';

// ans_type = 16
export class StartCompareAck extends Response {
    public isError(): boolean {
        return this.resultCode < 0;
    }
}
