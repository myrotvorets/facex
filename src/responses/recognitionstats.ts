import { Response } from './response';

// ans_type = 128
export class RecognitionStats extends Response {
    public get faceID(): number {
        return this._raw.data.results_amount;
    }

    public get matchesCount(): number {
        return this._raw.data.fotos[0]?.par1 ?? 0;
    }

    public get minSimilarity(): number {
        return this._raw.data.fotos[0]?.par2 ?? 0;
    }

    public get maxSimilarity(): number {
        return this._raw.data.fotos[0]?.par3 ?? 0;
    }

    public isCacheable(): boolean {
        return true;
    }
}
