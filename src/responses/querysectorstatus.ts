import { RawResponse, Response } from './response';

export class SectorEntry {
    private _parts: [string, string, string, string, string, string];

    // [
    //     '799493',
    //     '00:00:3e',
    //     '{12f690ae-1e3d-4736-a11a-f32577b4cfcf}',
    //     '2878',
    //     '27',
    //     '{path:..27\\00\\00\\3e\\12f690ae-1e3d-4736-a11a-f32577b4cfcf\\{12f690ae-1e3d-4736-a11a-f32577b4cfcf}\\2878.jpg|create_date:2020-06-24 11:10:22|comment:!1-0-62-399768}'
    // ]
    // path:..27\\00\\00\\3e\\12f690ae-1e3d-4736-a11a-f32577b4cfcf\\{12f690ae-1e3d-4736-a11a-f32577b4cfcf}\\2878.jpg
    // |create_date:2020-06-24 11:10:22
    // |comment:!1-0-62-399768
    public constructor(parts: [string, string, string, string, string, string]) {
        this._parts = parts;
    }

    public get key(): string {
        return `${this._parts[0]}*${this._parts[1]}`;
    }

    public get segment(): number {
        return -1;
    }

    public get bank(): number {
        return -1;
    }

    public get id(): number {
        return parseInt(this._parts[0], 10);
    }

    public get intName(): string {
        return this._parts[3];
    }

    public get name(): string {
        return this._parts[2].replace(/^{|}#?$/g, '');
    }

    public get listId(): number {
        return parseInt(this._parts[4], 10);
    }

    public get sector(): string {
        return this._parts[1];
    }

    public get meta(): Record<string, string> {
        const items = this._parts[5].split('|');
        const meta: Record<string, string> = {};
        items.forEach((item: string) => {
            const [key, value] = item.split(':').map((s) => s.trim());
            meta[key] = value;
        });

        return meta;
    }
}

// ans_type = 193
// result_code = -2: wrong guid
export class QuerySectorStatus extends Response {
    private _list: SectorEntry[] = [];

    public constructor(r: RawResponse) {
        super(r);

        if (this.isSucceeded() && r.data.fotos.length > 0 && typeof r.data.fotos[0].foto === 'string') {
            this._decodeList(r.data.fotos[0].foto);
        }
    }

    private _decodeList(encoded: string): void {
        const s = Buffer.from(encoded, 'base64').toString('binary');
        const decoded = s.split(/[\r\n]+/g).filter(Boolean);
        for (const item of decoded) {
            const parts = item.split('*', 6);
            if (parts.length === 6) {
                this._list.push(new SectorEntry(parts as [string, string, string, string, string, string]));
            }
        }
    }

    public isError(): boolean {
        return this.resultCode < 0;
    }

    public isAccepted(): boolean {
        return this.resultCode === 1;
    }

    public isPending(): boolean {
        return this.resultCode === 2;
    }

    public isSucceeded(): boolean {
        return this.resultCode === 3;
    }

    public cacheable(): boolean {
        return this.isSucceeded() || this.isError();
    }

    public get entries(): SectorEntry[] {
        return this._list;
    }
}
