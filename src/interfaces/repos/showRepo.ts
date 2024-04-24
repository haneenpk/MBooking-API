import { IShowRes, IShowToSave, IShowsOnAScreen, IShow } from "../schema/showSchema";
import { ID } from "../common";

export interface IShowRepo {
    saveShow (showToSave: IShowToSave): Promise<IShow>
    // findShowsOnDate  (theaterId: string, from: Date, to: Date): Promise<IShowsOnAScreen[]>
    // findShowById(id: ID): Promise<IShow>
    // getShowDetails (showId: string): Promise<IShow | null>
    getCollidingShowsOnTheScreen (screenId: any, startTime: any, endTime: any, date: Date): Promise<IShowRes[]>
}