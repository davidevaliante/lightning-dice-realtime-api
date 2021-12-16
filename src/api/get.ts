import {
  LightningDiceSpin,
  SpinModel,
} from "../mongoose-models/dreamcatcher/Spin";
import {
  LightningDiceStats,
  SymbolStats,
} from "../mongoose-models/dreamcatcher/Stats";
import { LightningSymbol } from "../mongoose-models/dreamcatcher/Symbols";
import { MonopolyTableModel } from "../mongoose-models/Tables";

export const getLatestSpins = async (count: number) => {
  const allSpins = await SpinModel.find().limit(count).sort({ timeOfSpin: -1 });
  return allSpins;
};

export const getLatestTable = async () => {
  const table = await MonopolyTableModel.find().limit(1).sort({ time: -1 });
  return table;
};

export const getStatsInTheLastHours = async (hoursToCheck: number) => {
  const now = new Date().getTime();

  const timeSince = now - hoursToCheck * 60 * 60 * 1000 - 5 * 1000;

  const spinsInTimeFrame = (await SpinModel.find(
    { timeOfSpin: { $gte: timeSince } },
    ["total", "multiplier"]
  ).sort({ timeOfSpin: -1 })) as LightningDiceSpin[];

  const totalSpins = spinsInTimeFrame.length;

  const stats = new LightningDiceStats(
    timeSince,
    totalSpins,
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
      (symbol: number) => {
        const timeSince = spinsInTimeFrame.map((s) => s.total).indexOf(symbol);

        const totalSymbolSpins = spinsInTimeFrame.filter(
          (spin) => spin.total == symbol
        );

        const totalSymbolMultiplier = totalSymbolSpins.reduce(
          (p, c) => p + parseInt(c.multiplier.split("X")[0]),
          0
        );

        const avg = Math.ceil(totalSymbolMultiplier / totalSymbolSpins.length);

        return new SymbolStats(
          symbol,
          (spinsInTimeFrame.filter((it) => it.total === symbol).length * 100) /
            totalSpins,
          timeSince != -1 ? timeSince : totalSpins,
          spinsInTimeFrame.filter((it) => it.total === symbol).length,
          avg
        );
      }
    )
  );

  return stats;
};

export const getInitialPageData = async (hoursToCheck: number) => {
  const now = new Date().getTime();

  const timeSince = now - hoursToCheck * 60 * 60 * 1000 - 5 * 1000;

  const spinsInTimeFrame = (await SpinModel.find({
    timeOfSpin: { $gte: timeSince },
  }).sort({ timeOfSpin: -1 })) as LightningDiceSpin[];

  const stats = await getStatsInTheLastHours(hoursToCheck);

  return {
    stats,
    spinsInTimeFrame,
  };
};
