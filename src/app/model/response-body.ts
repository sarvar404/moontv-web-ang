

export class ResponseBody {
    code?: string;
    message?: string;
    values?: any;
    success?: boolean;

    constructor(values: object = {}) {
        this.code = "";
        this.message = "";
        this.values = [];
        this.success = false;
        Object.assign(this,values);
    }

}