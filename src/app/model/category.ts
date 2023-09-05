export class Category {

    id?: number;
    title?: string;

    constructor(values: object = {})
    {
        Object.assign(this,values);
    }

}