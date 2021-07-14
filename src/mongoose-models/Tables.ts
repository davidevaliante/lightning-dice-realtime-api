import { prop, getModelForClass, ReturnModelType, modelOptions, Severity } from '@typegoose/typegoose';

@modelOptions({options : {allowMixed :Severity.ALLOW}})
export class MonopolyTable {
    // unique identifier
    @prop({required : true})
    public _id! :  string;

    // time related - when the spin occurred
    @prop({required : true})
    public time! : number;

    @prop({required : true})
    public lowTierTable! : {
        type : 'low' | 'mid' | 'high',
        rows : {
            rowPosition : number,
            percentage : number,
            lands : number,
            total : number
        }[]
    };

    @prop({required : true})
    public midTierTable! : {
        type : 'low' | 'mid' | 'high',
        rows : {
            rowPosition : number,
            percentage : number,
            lands : number,
            total : number
        }[]
    };

    @prop({required : true})
    public highTierTable! : {
        type : 'low' | 'mid' | 'high',
        rows : {
            rowPosition : number,
            percentage : number,
            lands : number,
            total : number
        }[]
    };
}

export const MonopolyTableModel = getModelForClass(MonopolyTable)