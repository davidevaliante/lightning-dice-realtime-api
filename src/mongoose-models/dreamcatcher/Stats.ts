import { LightningSymbol } from "./Symbols";

export class LightningDiceStats {
  constructor(
    public timeFrame: number,
    public totalSpins: number,
    public stats: SymbolStats[]
  ) {}
}

export class SymbolStats {
  constructor(
    public symbol: number,
    public percentage: number,
    public spinSince: number,
    public lands: number,
    public avgMultiplier: number
  ) {}
}
