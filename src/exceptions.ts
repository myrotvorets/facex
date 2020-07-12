import { Response } from 'node-fetch';

export class FaceXError extends Error {}
export class BadImageError extends FaceXError {}
export class NetworkError extends FaceXError {}

export class HttpError extends FaceXError {
    public readonly code: number;
    public readonly statusText: string;
    public body: string;

    public constructor(response: Response) {
        const code = response.status;
        const statusText = response.statusText;
        super(`HTTP Error ${code}`);

        this.code = code;
        this.statusText = statusText;
        this.body = '';
    }
}

export class BadResponseError extends FaceXError {}
