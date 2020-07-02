import stream from 'stream';
import { ClientBase } from './clientbase';
import * as R from './response';

export class Client extends ClientBase {
    public static readonly CMD_BASE_STATUS = 8;
    public static readonly CMD_START_COMPARE = 16;
    public static readonly CMD_UPLOAD_COMPARE = 17;
    public static readonly CMD_GET_COMPARISON_RESULTS = 18;
    public static readonly CMD_UPLOAD_SRCH = 32;
    public static readonly CMD_SRCH_STATUS = 64;
    public static readonly CMD_CAPTURED_FACES = 80;
    public static readonly CMD_RECOGNITION_STATS = 128;
    public static readonly CMD_MATCHED_FACES = 129;

    public async baseStatus(): Promise<R.BaseStatus> {
        const req = await this._newRequest(Client.CMD_BASE_STATUS);
        return await this._sendRequest(req);
    }

    public async uploadPhotoForSearch(
        photo: Buffer | string | stream.Readable,
        priority: 0 | 1 | 2 = 2,
        segment = '0',
        comment = '',
    ): Promise<R.SearchUploadAck | R.SearchUploadError> {
        const priorityLUT = ['A', 'B', 'C'];
        const [s, req] = await Promise.all([this._prepareFile(photo), this._newRequest(Client.CMD_UPLOAD_SRCH)]);
        req.data.foto = s;
        req.data.segment = segment;
        req.data.comment = comment;
        req.data.client_id = priorityLUT[priority];
        return this._sendRequest(req);
    }

    public async checkSearchStatus(guid: string): Promise<R.SearchInProgress | R.SearchFailed | R.SearchCompleted> {
        const req = await this._newRequest(Client.CMD_SRCH_STATUS, '0', guid);
        return this._sendRequest(req);
    }

    public async getCapturedFaces(guid: string): Promise<R.CapturedFaces | R.CapturedFacesError | R.SearchInProgress> {
        const req = await this._newRequest(Client.CMD_CAPTURED_FACES, '0', guid);
        return this._sendRequest(req);
    }

    public async getRecognitionStats(
        guid: string,
        n: number,
    ): Promise<R.RecognitionStats | R.RecognitionStatsNotAvailable> {
        const req = await this._newRequest(Client.CMD_RECOGNITION_STATS, '0', guid);
        req.data.ResultNumber = n;
        return this._sendRequest(req);
    }

    public async getMatchedFaces(
        guid: string,
        n: number,
        offset = 0,
        count = 20,
    ): Promise<R.Response | R.MatchedFaces> {
        const req = await this._newRequest(Client.CMD_MATCHED_FACES, '0', guid);
        req.data.ResultNumber = n;
        req.data.par1 = offset;
        req.data.par2 = count;
        return this._sendRequest(req);
    }

    public async startCompare(
        photo: Buffer | string | stream.Readable,
        photos: number,
        comment = '',
    ): Promise<R.StartCompareAck> {
        const [s, req] = await Promise.all([this._prepareFile(photo), this._newRequest(Client.CMD_START_COMPARE)]);
        req.data.foto = s;
        req.data.ResultNumber = photos;
        req.data.comment = comment;

        return this._sendRequest(req);
    }

    public async uploadPhotoForComparison(
        photo: Buffer | string | stream.Readable,
        guid: string,
        n: number,
        cnt: number,
        name: string,
    ): Promise<R.UploadCompareAck> {
        const [s, req] = await Promise.all([
            this._prepareFile(photo),
            this._newRequest(Client.CMD_UPLOAD_COMPARE, '', guid),
        ]);
        req.data.foto = s;
        req.data.comment = name;
        req.data.par1 = n;
        req.data.ResultNumber = cnt;

        return this._sendRequest(req);
    }

    public async getComparisonResults(guid: string): Promise<R.Response | R.CompareCompleted> {
        const req = await this._newRequest(Client.CMD_GET_COMPARISON_RESULTS, '', guid);
        return this._sendRequest(req);
    }
}
