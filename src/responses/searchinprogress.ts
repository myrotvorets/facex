import { Response } from './response';

// ans_type = 65
// ans_type = 85
export class SearchInProgress extends Response {
    public isError(): boolean {
        return this.type !== 65;
    }
}
