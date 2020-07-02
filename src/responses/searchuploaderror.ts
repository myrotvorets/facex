import { Response } from './response';

// ans_type = 34
export class SearchUploadError extends Response {
    public isError(): boolean {
        return true;
    }
}
