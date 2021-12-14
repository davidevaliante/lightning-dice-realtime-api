import { prop, getModelForClass } from "@typegoose/typegoose";

export class LightningDiceSpin {
  // unique identifier
  @prop({ required: true })
  public _id!: string;

  // time related - when the spin occurred
  @prop({ required: true })
  public timeOfSpin!: number;
  @prop({ required: true })
  public rawTime!: string;
  @prop({ required: true })
  public date!: Date;

  @prop({ required: true })
  public multiplier!: string;

  @prop({ required: true })
  public isLightning!: boolean;

  @prop({ required: true })
  public dices!: number[];

  @prop({ required: true })
  public total!: number;

  @prop({ required: true })
  public lightningNumbers!: any;

  @prop({ required: true })
  public totalWinners!: number;

  @prop({ required: true })
  public totalPayout!: string;
}

export const SpinModel = getModelForClass(LightningDiceSpin);
