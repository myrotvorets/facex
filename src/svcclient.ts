import { ClientBase, Request } from './clientbase';
import * as R from './response';

export class SvcClient extends ClientBase {
    public static readonly CMD_BASE_STATUS = 8;
    public static readonly CMD_SECTOR_REQUEST_INIT = 192;
    public static readonly CMD_SECTOR_REQUEST_STATUS = 193;
    public static readonly CMD_SECTOR_REQUEST_RESULT = 194;
    public static readonly CMD_SECTOR_STATS_INIT = 200;
    public static readonly CMD_SECTOR_STATS_RESULT = 201;
    public static readonly CMD_INSERT_INIT = 204;
    public static readonly CMD_INSERT_STATUS = 205;
    public static readonly CMD_INSERT_GET_FACES = 206;
    public static readonly CMD_INSERT_PROCESS = 207;
    public static readonly CMD_DELETE_INIT = 208;
    public static readonly CMD_DELETE_STATUS = 209;

    protected _encodeRequest(s: Request): string {
        return '0\r\n' + JSON.stringify(s) + '\r\n0\r\n\r\n';
    }

    public async numberOfRecords(): Promise<R.NumberOfRecords> {
        const req = await this._newRequest(SvcClient.CMD_BASE_STATUS);
        return this._sendRequest(req);
    }

    public async querySector(segment: string, sector: string): Promise<R.QuerySectorAck> {
        const req = await this._newRequest(SvcClient.CMD_SECTOR_REQUEST_INIT, segment);
        req.data.comment = sector;
        return this._sendRequest(req);
    }

    public async querySectorStatus(guid: string): Promise<R.QuerySectorStatus> {
        const req = await this._newRequest(SvcClient.CMD_SECTOR_REQUEST_STATUS, '', guid);
        return this._sendRequest(req);
    }

    public async getFaces(guid: string, sector: string, start = 0, count = -1): Promise<R.QuerySectorResult> {
        const req = await this._newRequest(SvcClient.CMD_SECTOR_REQUEST_RESULT, '', guid);
        req.data.par1 = start;
        req.data.par2 = count;
        req.data.comment = sector;
        return this._sendRequest(req);
    }

    public async querySectorStats(segment: string): Promise<R.QuerySectorStatsAck> {
        const req = await this._newRequest(SvcClient.CMD_SECTOR_STATS_INIT, segment);
        return this._sendRequest(req);
    }

    public async querySectorStatsResult(guid: string): Promise<R.QuerySectorStatsResult> {
        const req = await this._newRequest(SvcClient.CMD_SECTOR_STATS_RESULT, '', guid);
        return this._sendRequest(req);
    }

    public async preparePhotoForAddition(
        photo: Buffer | string | NodeJS.ReadableStream,
        segment: string,
        sector: string,
        filename: string,
    ): Promise<R.PrepareAddAck> {
        const [data, req] = await Promise.all([
            this._prepareFile(photo),
            this._newRequest(SvcClient.CMD_INSERT_INIT, segment),
        ]);

        req.data.foto = data;
        req.data.comment = `${sector}<${filename}`;
        return this._sendRequest(req);
    }

    public async getPrepareStatus(guid: string): Promise<R.PrepareAddStatus> {
        const req = await this._newRequest(SvcClient.CMD_INSERT_STATUS, '0', guid);
        return this._sendRequest(req);
    }

    public async getPreparedFaces(guid: string): Promise<R.PreparedFaces> {
        const req = await this._newRequest(SvcClient.CMD_INSERT_GET_FACES, '0', guid);
        return this._sendRequest(req);
    }

    public async addPreparedFaces(guid: string, list?: number[]): Promise<R.AddPreparedFacesAck> {
        const items = Buffer.from(list ? list.join('*') : '-1', 'binary').toString('base64');
        const req = await this._newRequest(SvcClient.CMD_INSERT_PROCESS, '0', guid);
        req.data.foto = items;
        return this._sendRequest(req);
    }

    public async deleteFace(items: string[]): Promise<R.DeleteAck> {
        const req = await this._newRequest(SvcClient.CMD_DELETE_INIT, '0');
        req.data.foto = Buffer.from(items.join('\r\n') + '\r\n', 'binary').toString('base64');
        return this._sendRequest(req);
    }

    public async deleteFaceResult(guid: string): Promise<R.DeleteStatus> {
        const req = await this._newRequest(SvcClient.CMD_DELETE_STATUS, '0', guid);
        return this._sendRequest(req);
    }
}
