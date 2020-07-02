import { PhotoEntry, Response } from './response';

export class StoredFace {
    private _e: PhotoEntry;

    public constructor(x: PhotoEntry) {
        this._e = x;
    }

    public get number(): number {
        return this._e.par1;
    }

    public get bank(): number {
        return this._e.par2;
    }

    public get id(): number {
        return this._e.par3;
    }

    public get face(): string {
        return typeof this._e.foto === 'string' ? this._e.foto : '';
    }

    public get faceAsBuffer(): Buffer {
        return Buffer.from(this._e.foto || '', 'base64');
    }

    public get intName(): string {
        return typeof this._e.namef === 'string' ? this._e.namef : '';
    }

    public get name(): string {
        return typeof this._e.namel === 'string' ? this._e.namel.slice(0, -2) : '';
    }

    public get path(): string {
        return typeof this._e.path === 'string' ? this._e.path : '';
    }
}

// ans_type = 194
export class QuerySectorResult extends Response {
    private _idx = 0;

    public isCacheable(): boolean {
        return true;
    }

    public [Symbol.iterator](): Iterator<StoredFace> {
        return {
            next: (): IteratorResult<StoredFace> => {
                if (this._idx < this._raw.data.fotos.length) {
                    return {
                        value: new StoredFace(this._raw.data.fotos[this._idx++]),
                        done: false,
                    };
                }

                this._idx = 0;
                return { value: (undefined as unknown) as StoredFace, done: true };
            },
        };
    }
}
