import { PhotoEntry, RawResponse, Response } from './response';

export interface SearchStats {
    faceID: number;
    count: number;
    confidence: number;
}

// ans_type = 67
export class SearchCompleted extends Response {
    protected _stats: SearchStats[];
    private _idx = 0;

    public constructor(r: RawResponse) {
        super(r);
        this._stats = r.data.fotos.map((item: PhotoEntry) => ({
            faceID: item.par1,
            count: item.par2,
            confidence: item.par3,
        }));

        Object.freeze(this._stats);
    }

    public get stats(): SearchStats[] {
        return this._stats;
    }

    public isCacheable(): boolean {
        return true;
    }

    public [Symbol.iterator](): Iterator<SearchStats, undefined> {
        return {
            next: (): IteratorResult<SearchStats, undefined> => {
                if (this._idx < this._stats.length) {
                    return {
                        value: this._stats[this._idx++],
                        done: false,
                    };
                }

                this._idx = 0;
                return { value: undefined, done: true };
            },
        };
    }
}
