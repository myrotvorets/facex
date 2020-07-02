import iconv from 'iconv-lite';
import { RawResponse, Response } from './response';

// ans_type = 201
// result_code = -2: wrong guid
export class QuerySectorStatsResult extends Response {
    private _list: Record<string, number> = {};

    public constructor(r: RawResponse) {
        super(r);

        if (this.isSucceeded() && r.data.fotos.length > 0 && typeof r.data.fotos[0].foto === 'string') {
            this._decodeList(r.data.fotos[0].foto);
            Object.freeze(this._list);
        }
    }

    private _decodeList(encoded: string): void {
        const s = iconv.decode(Buffer.from(encoded, 'base64'), 'cp1251');
        const decoded = s.split(/[\r\n]+/g).filter(Boolean);
        for (const item of decoded) {
            const parts = item.split('*', 2);
            if (parts.length === 2) {
                const sector = parts[0];
                const count = parseInt(parts[1], 10);
                this._list[sector] = count;
            }
        }
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }

    public isPending(): boolean {
        return this.resultCode === 2 || this.resultCode === 1;
    }

    public isSucceeded(): boolean {
        return this.resultCode === 3;
    }

    public get entries(): Record<string, number> {
        return this._list;
    }
}
