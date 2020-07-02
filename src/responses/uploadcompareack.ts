import { Response } from './response';

// ans_type = 17
export class UploadCompareAck extends Response {
    public isError(): boolean {
        return this.resultCode < 0;
    }
}
