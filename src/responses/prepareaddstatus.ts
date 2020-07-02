import { Response } from './response';

// ans_type = 205
export class PrepareAddStatus extends Response {
    public isAccepted(): boolean {
        return this.resultCode === 1;
    }

    public isPending(): boolean {
        return this.resultCode === 1 || this.resultCode === 2 || this.resultCode === 4 || this.resultCode === 5;
    }

    public isSucceeded(): boolean {
        return this.resultCode === 3;
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }

    public numberOfCapturedFaces(): number {
        return this.resultsAmount;
    }
}
