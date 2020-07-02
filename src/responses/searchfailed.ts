import { Response } from './response';

// ans_type = 66
export class SearchFailed extends Response {
    public isError(): boolean {
        return true;
    }
}
