//TODO: Do we need this?

type SortDirection = "asc" | "desc";

type DataSourceRecord<TRecord extends Record<string, unknown>> = {
    recNo: number;
    fields: TRecord;
}

class DataSource<TRecord extends Record<string, unknown>> {
    private _data: TRecord[];

    private _currentRecordIndex: number;

    constructor(data: TRecord[]) {
        this._data = data;
        this._reset();
    }

    public sliceAndMap<T>(recNo: number, recCount: number, mapFn: (rec: DataSourceRecord<TRecord>) => T): T[] {
        const result: T[] = [];
        this.recNo = recNo;
        while (result.length < recCount && !this.eof) {
            const rec = this.currentRecord;
            const item = mapFn(rec);
            result.push(item);
            this.next();
        }
        return result;
    }

    public sort(field: keyof TRecord, direction?: SortDirection) {
        this._data.sort((a, b) => {
            const res = a[field] < b[field] ? -1 : (a[field] > b[field]) ? 1 : 0;
            return direction === "desc" ? -res : res;
        });
    }

    public customSort(compareFn: (a: TRecord, b: TRecord, direction?: SortDirection) => number, direction?: SortDirection) {
        this._data.sort((a, b) => compareFn(a, b, direction));
    }

    public get eof(): boolean {
        return this._currentRecordIndex >= this._data.length;
    };

    public get bof(): boolean {
        return this._currentRecordIndex < 0;
    };

    public get recordCount(): number {
        return this._data.length;
    };

    public get recNo(): number {
        if (this._data.length > 0 && this._currentRecordIndex >= 0) {
            return this._currentRecordIndex + 1;
        }
        return 0;
    };

    public set recNo(value: number) {
        if (value > 0 || value < this._data.length) {
            this._currentRecordIndex = value - 1;
        }
    };

    public first() {
        this.recNo = 1;
    }

    public last() {
        this.recNo = this.recordCount;
    }

    public next(): boolean {
        this._currentRecordIndex++;
        if (this._currentRecordIndex >= this.recordCount) {
            this._currentRecordIndex = this.recordCount;
            return false;
        }
        return true;
    }

    public prev(): boolean {
        this._currentRecordIndex--;
        if (this._currentRecordIndex < 0) {
            this._currentRecordIndex = -1;
            return false;
        }
        return true;
    }

    public get currentRecord(): DataSourceRecord<TRecord> {
        if (this.recordCount === 0) {
            return;
        }

        let recIndex = this._currentRecordIndex;

        if (this.bof) {
            recIndex = 0;
        }
        if (this.eof) {
            recIndex = this.recordCount - 1;
        }

        const record: DataSourceRecord<TRecord> = {
            recNo: this.recNo,
            fields: {} as TRecord
        }

        const dataRecord = this._data[recIndex];
        for (const f in dataRecord) {
            record.fields[f] = dataRecord[f];
        }

        return record;
    }

    private _reset() {
        this._currentRecordIndex = -1;
    }
}

export { DataSource, DataSourceRecord, SortDirection }
