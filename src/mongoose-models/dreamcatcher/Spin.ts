import { prop, getModelForClass } from '@typegoose/typegoose';

export class DreamCatcherSpin {
    // unique identifier
    @prop({required : true})
    public _id! :  string;

    // time related - when the spin occurred
    @prop({required : true})
    public timeOfSpin! : number;
    @prop({required : true})
    public rawTime! : string;
    @prop({required : true})
    public date! : Date;

    @prop({required : true})
    public spinResultSymbol! : string;

    @prop({required : true})
    public multiplier! : string;

    @prop({required : true})
    public specialMultiplier! : string;

    @prop({required : true})
    public totalWinners! : number;

    @prop({required : true})
    public totalPayout! : number;

    @prop({required : true})
    public watchVideo! : string;
}

export const SpinModel = getModelForClass(DreamCatcherSpin)