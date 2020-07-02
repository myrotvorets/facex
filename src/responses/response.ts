export interface PhotoEntry {
    par1: number;
    par2: number;
    par3: number;
    foto: string | null;
    namef: string | null;
    namel: string | null;
    path: string | null;
}

export interface RawResponseData {
    id: string;
    client_id: string;
    reqID_serv: string | null;
    reqID_clnt: string;
    segment: string;
    datetime: string;
    result_code: number;
    results_amount: number;
    comment: string;
    fotos: PhotoEntry[];
}

export interface RawResponse {
    ans_type: number;
    signature: string;
    data: RawResponseData;
}

export class Response {
    protected _raw: RawResponse;

    public constructor(r: RawResponse) {
        this._raw = r;
        Object.freeze(this._raw);
        Object.freeze(this._raw.data);
        Object.freeze(this._raw.data.fotos);
    }

    public get type(): number {
        return this._raw.ans_type;
    }

    public get id(): string {
        return this._raw.data.id;
    }

    public get clientId(): string {
        return this._raw.data.client_id;
    }

    public get serverRequestID(): string {
        return this._raw.data.reqID_serv + '';
    }

    public get clientRequestID(): string {
        return this._raw.data.reqID_clnt;
    }

    public get segment(): string {
        return this._raw.data.segment;
    }

    public get dateTime(): string {
        return this._raw.data.datetime;
    }

    public get resultCode(): number {
        return this._raw.data.result_code;
    }

    public get resultsAmount(): number {
        return this._raw.data.results_amount;
    }

    public get comment(): string {
        return this._raw.data.comment;
    }

    public isError(): boolean {
        return false;
    }

    public isCacheable(): boolean {
        return false;
    }
}
