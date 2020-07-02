import { PhotoEntry, Response } from './response';

export class ComparisonResult {
    private _e: PhotoEntry;

    public constructor(x: PhotoEntry) {
        this._e = x;
    }

    public get similarity(): number {
        return this._e.par2;
    }

    public get name(): string {
        return this._e.namef || '';
    }
}

// ans_type = 18
export class CompareCompleted extends Response {
    private _idx = 0;

    public isError(): boolean {
        return this.resultCode < 0;
    }

    public isPending(): boolean {
        return this.resultCode === 2;
    }

    public isCacheable(): boolean {
        return this.resultCode === 3 || this.resultCode === -7;
    }

    public [Symbol.iterator](): Iterator<ComparisonResult> {
        return {
            next: (): IteratorResult<ComparisonResult> => {
                if (this._idx < this._raw.data.fotos.length) {
                    return {
                        value: new ComparisonResult(this._raw.data.fotos[this._idx++]),
                        done: false,
                    };
                }

                this._idx = 0;
                return { value: (undefined as unknown) as ComparisonResult, done: true };
            },
        };
    }
}
