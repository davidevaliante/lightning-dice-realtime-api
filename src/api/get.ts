import { DreamCatcherSpin, SpinModel } from '../mongoose-models/dreamcatcher/Spin'
import { CrazyTimeStats, SymbolStats } from '../mongoose-models/dreamcatcher/Stats'
import { DreamCatcherSymbol } from '../mongoose-models/dreamcatcher/Symbols'
import { MonopolyTableModel } from '../mongoose-models/Tables'

export const getLatestSpins = async (count : number) => {
    const allSpins = await SpinModel.find().limit(count).sort({'timeOfSpin' : -1})
    return allSpins
}

export const getLatestTable = async () => {
    const table = await MonopolyTableModel.find().limit(1).sort({'time' : -1})
    return table
}

export const getStatsInTheLastHours = async (hoursToCheck : number) => {

    const now = new Date().getTime()

    const timeSince = now - hoursToCheck * 60 * 60 * 1000 - 5 * 1000

    const spinsInTimeFrame = await SpinModel.find({timeOfSpin:{$gte:timeSince}}, 'spinResultSymbol').sort({'timeOfSpin' : -1}) as DreamCatcherSpin[]

    const totalSpins = spinsInTimeFrame.length
   
    const stats = new CrazyTimeStats(
        timeSince,
        totalSpins,
        Object.values(DreamCatcherSymbol).filter(it => typeof(it) !== 'number').map((symbol : DreamCatcherSymbol) => {

            const timeSince = spinsInTimeFrame.map(s => s.spinResultSymbol).indexOf(symbol.toString())
            
            return new SymbolStats(
                symbol,
                spinsInTimeFrame.filter(it => it.spinResultSymbol === symbol.toString()).length * 100 / totalSpins,
                timeSince != -1 ? timeSince : totalSpins,
                spinsInTimeFrame.filter(it => it.spinResultSymbol === symbol.toString()).length
            )
        })
    )

    return stats
}

export const getInitialPageData = async (hoursToCheck : number) => {

    const now = new Date().getTime()

    const timeSince = now - hoursToCheck * 60 * 60 * 1000 - 5 * 1000

    const spinsInTimeFrame = await SpinModel.find({timeOfSpin:{$gte:timeSince}}, ).sort({'timeOfSpin' : -1}) as DreamCatcherSpin[]

    const stats = await getStatsInTheLastHours(hoursToCheck)


    return {
        stats,
        spinsInTimeFrame
    }
}