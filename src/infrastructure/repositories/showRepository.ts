import { IMovieRepo } from "../../interfaces/repos/movieRepo";
import { IShow, IShowRes, IShowToSave } from "../../interfaces/schema/showSchema";
import { showModel } from "../../entities/models/showModel";
import { ID } from "../../interfaces/common";

export class ShowRepository implements IMovieRepo {

  async findShowById(id: ID): Promise<IShow | null> {
    return await showModel.findById({ _id: id })
  }

  async saveShow(showToSave: IShowToSave): Promise<IShow> {
    return await new showModel(showToSave).save() as unknown as IShow
  }

  async findShowBySId(id: string): Promise<IShow | null> {
    return await showModel.findById({ _id: id })
  }

  async getCollidingShowsOnTheScreen(screenId: any, startTime: any, endTime: any): Promise<IShowRes[]> {
    return await showModel.find({
      screenId,
      $or: [
        {
          $and: [
            { "startTime.hour": { $lte: startTime.hour } },
            { "startTime.minute": { $lte: startTime.minute } },
            { "endTime.hour": { $gte: startTime.hour } },
            { "endTime.minute": { $gte: startTime.minute } }
          ]
        },
        {
          $and: [
            { "startTime.hour": { $gte: startTime.hour } },
            { "startTime.minute": { $gte: startTime.minute } },
            { "endTime.hour": { $lte: endTime.hour } },
            { "endTime.minute": { $lte: endTime.minute } }
          ]
        },
        {
          $and: [
            { "startTime.hour": { $lte: endTime.hour } },
            { "startTime.minute": { $lte: endTime.minute } },
            { "endTime.hour": { $gte: endTime.hour } },
            { "endTime.minute": { $gte: endTime.minute } }
          ]
        }
      ]
    });
  }


}