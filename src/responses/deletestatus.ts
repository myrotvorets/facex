import { RawResponse, Response } from './response';

// ans_type = 209
// result_code: -2: unknown GUID
export class DeleteStatus extends Response {
    private _list: string[] | undefined;

    public constructor(r: RawResponse) {
        super(r);

        if (this.isSucceeded() && typeof r.data.fotos?.[0]?.foto === 'string') {
            const decoded = Buffer.from(r.data.fotos[0].foto, 'base64').toString('binary');
            this._list = decoded.split(/[\r\n]+/).filter(Boolean);
        }
    }

    public isAccepted(): boolean {
        return this.resultCode === 1;
    }

    public isPending(): boolean {
        return this.resultCode === 1 || this.resultCode === 2;
    }

    public isSucceeded(): boolean {
        return this.resultCode === 3;
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }

    public get list(): string[] {
        return this._list || [];
    }
}
