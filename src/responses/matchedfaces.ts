import { PhotoEntry, Response } from './response';

export class Match {
    private _e: PhotoEntry;

    public constructor(x: PhotoEntry) {
        this._e = x;
    }

    public get faceNo(): number {
        return this._e.par1;
    }

    public get index(): number {
        return this._e.par2;
    }

    public get similarity(): number {
        return this._e.par3;
    }

    public get nameF(): string {
        return this._e.namef as string;
    }

    public get nameL(): string {
        return this._e.namel as string;
    }

    public get path(): string {
        return this._e.path as string;
    }

    public get pathParsed(): [string, number, number, string] {
        const parts = (this._e.path as string).split('*', 4);

        /*
         * Проверьте в команде 129 параметр path. Теперь он имеет вид:
         * сектор*номер_захваченного_лица*номер_результата_распознавания*полный_путь_к_ файлу_при_занесении_в_базу
         */
        return [
            parts[0], // sector
            parseInt(parts[1], 10), // number of the captured face
            parseInt(parts[2], 10), // number of result
            parts[3],
        ];
    }

    public get face(): string {
        return this._e.foto as string;
    }

    public get faceAsBuffer(): Buffer {
        return Buffer.from(this._e.foto as string, 'base64');
    }
}

// ans_type = 129
export class MatchedFaces extends Response {
    private _idx = 0;

    public isCacheable(): boolean {
        return true;
    }

    public [Symbol.iterator](): Iterator<Match, undefined> {
        return {
            next: (): IteratorResult<Match, undefined> => {
                if (this._idx < this._raw.data.fotos.length) {
                    return {
                        value: new Match(this._raw.data.fotos[this._idx++]),
                        done: false,
                    };
                }

                this._idx = 0;
                return { value: undefined, done: true };
            },
        };
    }
}
