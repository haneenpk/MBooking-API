import { RowType } from "../../interfaces/common";
import { IScreenSeatCategory } from "../../interfaces/schema/screenSeatSchema";
import { IShowSeatCategory, IShowSingleSeat, IShowSeats } from "../../interfaces/schema/showSeatSchema";
import { IScreenSeatRes } from "../../interfaces/schema/screenSeatSchema";

export function getShowSeatCategory (screenCat: IScreenSeatCategory, price: number): IShowSeatCategory | undefined {
    if (screenCat.seats.size === 0) return undefined
    const showSeatMap: Map<RowType, IShowSingleSeat[]> = new Map()
    for (const [rowName, row] of screenCat.seats) { 
        const showSeatRow: IShowSingleSeat[] = row.map(x => ({ col: x, isBooked: false, isTempBooked: false }))
        showSeatMap.set(rowName as RowType, showSeatRow)
    }

    return {
        name: screenCat.name,
        price,
        seats: showSeatMap
    }
}

export function createEmptyShowSeat (screenSeat: IScreenSeatRes, diamond: any, gold: any, silver: any): Partial<Omit<IShowSeats, '_id'>> {
    return {
        diamond: getShowSeatCategory(screenSeat.diamond, diamond),
        gold: getShowSeatCategory(screenSeat.gold, gold),
        silver: getShowSeatCategory(screenSeat.silver, silver)
    }
}