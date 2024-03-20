import { ID } from "../common"
import { ITempTheaterReq, ITempTheaterRes } from "../schema/tempTheaterSchema"

export interface ITempTheaterRepo {
    saveTheater(theater: ITempTheaterReq): Promise<ITempTheaterRes>
    unsetTheaterOTP (id: ID, email: string ): Promise<ITempTheaterRes | null>
}