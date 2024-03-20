import { log } from "console";
import { ALPHABETS } from "../../constants/constants";
import { IScreenSeatSave } from "../../interfaces/schema/screenSeatSchema";
import { ColType } from "../../interfaces/common";

function splitAlphabetsToThree (rows: string) {
    const index = Number(rows);
    console.log("i :", index);
    
    const availRows = ALPHABETS.slice(0, index)
    let diamondSeats = ''
    let goldSeats = ''
    let silverSeats = ''

    diamondSeats += availRows.slice(0, 4);
    goldSeats += availRows.slice(4, 8);
    if (index >= 8) silverSeats += availRows.slice(8, index);
    
    return {
        diamondSeats,
        goldSeats,
        silverSeats
    }
}

function assignSeats <T>(seatAlphabets: string, rowArr: T): Map<string, T> {
    const seatMap = new Map()
    for (let i=0; i<seatAlphabets.length; i++) {
        seatMap.set(seatAlphabets[i], rowArr)
    }
    return seatMap
}

export function getDefaultScreenSeatSetup(rows: string, cols: number): IScreenSeatSave {
    const seats = splitAlphabetsToThree(rows)
    console.log("seatsss:", seats);
    
    const { diamondSeats, goldSeats, silverSeats } = seats

    // Populate an array with objects from { col: 1 } to { col: cols }
    const rowArr: ColType[] = Array.from({ length: cols }, (_, index) => index + 1 ) as ColType[]

    log(rowArr, 'default rowArr for assingning to seats')
    const diamondSeatMap = assignSeats(diamondSeats, rowArr)
    const goldSeatMap = assignSeats(goldSeats, rowArr)
    const silverSeatMap = assignSeats(silverSeats, rowArr)

    log(diamondSeatMap, goldSeatMap, silverSeatMap, 'seat maps from get default seats setup')

    return {
        diamond: { seats: diamondSeatMap },
        gold: { seats: goldSeatMap },
        silver: { seats: silverSeatMap }
    }
}