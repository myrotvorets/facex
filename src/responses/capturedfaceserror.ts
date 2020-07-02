import { Response } from './response';

// ans_type = 87
export class CapturedFacesError extends Response {
    public isError(): boolean {
        return true;
    }
}
