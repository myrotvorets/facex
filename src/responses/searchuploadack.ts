import { Response, RawResponse } from './response';

// ans_type = 33
export class SearchUploadAck extends Response {
    protected _queueStats: [number, number, number] = [0, 0, 0];

    public constructor(r: RawResponse) {
        super(r);

        const matches = r.data.comment.match(/^AQ=(\d+)\/BQ=(\d+)\/CQ=(\d+)/);
        if (matches) {
            this._queueStats = [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3], 10)];
        }

        Object.freeze(this._queueStats);
    }

    public get queueStats(): [number, number, number] {
        return this._queueStats;
    }
}
