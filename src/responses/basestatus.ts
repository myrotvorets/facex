import { PhotoEntry, Response } from './response';

export class SegmentStats {
    private _e: PhotoEntry;

    public constructor(x: PhotoEntry) {
        this._e = x;
    }

    public get segment(): string | number {
        return this._e.par1;
    }

    public get size(): number {
        return this._e.par2;
    }

    public get records(): number {
        return this._e.par3;
    }

    public get bankStats(): number[] {
        if (typeof this._e.path === 'string') {
            return this._e.path
                .split(';')
                .filter(Boolean)
                .map((item: string): number => parseInt(item, 10));
        }

        return [];
    }
}

// ans_type = 8
export class BaseStatus extends Response {
    private _idx = 0;

    public [Symbol.iterator](): Iterator<SegmentStats> {
        return {
            next: (): IteratorResult<SegmentStats> => {
                if (this._idx < this._raw.data.fotos.length) {
                    return {
                        value: new SegmentStats(this._raw.data.fotos[this._idx++]),
                        done: false,
                    };
                }

                this._idx = 0;
                return { value: (undefined as unknown) as SegmentStats, done: true };
            },
        };
    }
}
