import crypto from 'crypto';
import fetch from 'node-fetch';
import sharp from 'sharp';
import util from 'util';
import debug from 'debug';
import { RawResponse, Response } from './response';
import { responseFactory } from './responsefactory';
import { BadImageError, HttpError, BadResponseError } from './exceptions';

export interface RequestPayload {
    client_id: string;
    reqID_clnt: string;
    reqID_serv: string;
    datetime: string;
    segment: string;
    foto: string | null;
    ResultNumber: number;
    par1: number;
    par2: number;
    comment: string;
}

export interface Request {
    req_type: number;
    signature: string;
    data: RequestPayload;
}

const randomBytes = util.promisify(crypto.randomBytes);
const dbg = debug('facex');
const dbgll = debug('facex:ll');

export class ClientBase {
    protected _url: URL;
    protected _clientId: string;

    public constructor(url: string, clientId = '') {
        this._url = new URL(url);
        this._clientId = clientId;
    }

    public get clientId(): string {
        return this._clientId;
    }

    public set clientId(v: string) {
        this._clientId = v;
    }

    protected async _newRequest(type: number, segment = '0', reqID = ''): Promise<Request> {
        return {
            req_type: type,
            signature: '',
            data: {
                client_id: this._clientId,
                reqID_clnt: await ClientBase._guidv4(),
                reqID_serv: reqID,
                segment,
                datetime: new Date().toJSON(),
                foto: null,
                ResultNumber: 0,
                par1: 0,
                par2: 0,
                comment: '',
            },
        };
    }

    protected static async _guidv4(): Promise<string> {
        const buf = await randomBytes(16);
        buf[6] = (buf[6] & 0x0f) | 0x40;
        buf[8] = (buf[8] & 0x3f) | 0x80;
        const s: string = buf.toString('hex');
        return (
            s.slice(0, 8) + '-' + s.slice(8, 12) + '-' + s.slice(12, 16) + '-' + s.slice(16, 20) + '-' + s.slice(20, 32)
        );
    }

    protected _encodeRequest(s: Request): string {
        return JSON.stringify(s);
    }

    protected async _sendRequest<R extends Response>(req: Request): Promise<R> {
        dbg(req);
        const encoded = this._encodeRequest(req);
        dbgll('SEND:', encoded);
        const response = await fetch(this._url, {
            method: 'POST',
            body: encoded,
            headers: {
                'Content-Type': 'text/json',
                'Content-Length': `${encoded.length}`,
            },
        });

        if (!response.ok) {
            const err = new HttpError(response);
            try {
                err.body = await response.text();
            } catch (e) {
                // Do nothing
            }

            throw err;
        }

        const text = await response.text();
        dbgll('RECV:', text);

        let body: RawResponse;
        try {
            body = JSON.parse(text);
        } catch (e) {
            throw new BadResponseError(text);
        }

        const ret = responseFactory(body) as R;
        dbg(ret);
        return ret;
    }

    protected async _prepareFile(s: Buffer | string | NodeJS.ReadableStream): Promise<string> {
        let img: sharp.Sharp;

        try {
            if (typeof s === 'object' && 'pipe' in s) {
                img = sharp({ failOnError: false, sequentialRead: true });
                s.pipe(img);
            } else {
                img = sharp(s, { failOnError: false, sequentialRead: true });
            }
        } catch (e) {
            throw new BadImageError((e as Error).message);
        }

        const metadata = await img.metadata();
        const isJPEG = metadata.format === 'jpeg';
        const sf = metadata.chromaSubsampling || '';
        const isProgressive = !!metadata.isProgressive;
        const flag = !isJPEG || sf !== '4:2:0' || isProgressive;
        if (flag) {
            img.jpeg({
                progressive: false,
                chromaSubsampling: '4:2:0',
            });
        }

        const buf = await img.toBuffer();
        return buf.toString('base64');
    }
}
