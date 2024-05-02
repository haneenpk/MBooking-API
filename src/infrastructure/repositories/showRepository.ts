import { IShowRepo } from "../../interfaces/repos/showRepo";
import { IShow, IShowRes, IShowToSave } from "../../interfaces/schema/showSchema";
import { showModel } from "../../entities/models/showModel";
import { ID } from "../../interfaces/common";
import { ObjectId } from 'mongodb'; // Import ObjectId from MongoDB library

export class ShowRepository implements IShowRepo {

  async findShowById(id: ID): Promise<IShow | null> {
    return await showModel.findById({ _id: id })
  }

  async saveShow(showToSave: IShowToSave): Promise<IShow> {
    return await new showModel(showToSave).save() as unknown as IShow
  }

  async editShow(showToEdit: any, showId: string): Promise<any> {
    return await showModel.findByIdAndUpdate(
      { _id: showId },
      {
        $set: showToEdit
      },
      { new: true }
    )
  }

  async updatedAvailSeat(id: ID, seatCount: number) {
    return await showModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { availableSeatCount: seatCount } },
      { new: true }
    )
  }

  async findShowBySId(id: string): Promise<IShow | null> {
    return await showModel.findById({ _id: id })
  }

  async findDates(currDate: Date, theaterId: string) {
    return await showModel.distinct("date", {
      date: { $gte: currDate },
      theaterId: theaterId
    });
  }

  async findFirstShows(currDate: Date, theaterId: string) {
    // Set the time component of currDate to midnight
    const startOfDay = new Date(currDate);
    startOfDay.setHours(0, 0, 0, 0);

    console.log("strt", startOfDay);

    // Find shows for the current date
    return await showModel.find({
      date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) }, // Matches dates within the current day
      theaterId: theaterId
    });
  }

  async getCollidingShowsOnTheScreen(screenId: any, startTime: any, endTime: any, date: Date): Promise<IShowRes[]> {
    return await showModel.find({
      screenId,
      $or: [
        {
          $and: [
            { "startTime.hour": { $lte: startTime.hour } },
            { "startTime.minute": { $lte: startTime.minute } },
            { "endTime.hour": { $gte: startTime.hour } },
            { "endTime.minute": { $gte: startTime.minute } },
            { date: date }
          ]
        },
        {
          $and: [
            { "startTime.hour": { $gte: startTime.hour } },
            { "startTime.minute": { $gte: startTime.minute } },
            { "endTime.hour": { $lte: endTime.hour } },
            { "endTime.minute": { $lte: endTime.minute } },
            { date: date }
          ]
        },
        {
          $and: [
            { "startTime.hour": { $lte: endTime.hour } },
            { "startTime.minute": { $lte: endTime.minute } },
            { "endTime.hour": { $gte: endTime.hour } },
            { "endTime.minute": { $gte: endTime.minute } },
            { date: date }
          ]
        }
      ]
    });
  }

  async getCollidingShowsOnTheEditScreen(screenId: any, startTime: any, endTime: any, date: Date, showId: string): Promise<IShowRes[]> {
    return await showModel.find({
      screenId,
      $or: [
        {
          $and: [
            { _id: { $ne: showId } },
            { "startTime.hour": { $lte: startTime.hour } },
            { "startTime.minute": { $lte: startTime.minute } },
            { "endTime.hour": { $gte: startTime.hour } },
            { "endTime.minute": { $gte: startTime.minute } },
            { date: date }
          ]
        },
        {
          $and: [
            { _id: { $ne: showId } },
            { "startTime.hour": { $gte: startTime.hour } },
            { "startTime.minute": { $gte: startTime.minute } },
            { "endTime.hour": { $lte: endTime.hour } },
            { "endTime.minute": { $lte: endTime.minute } },
            { date: date }
          ]
        },
        {
          $and: [
            { _id: { $ne: showId } },
            { "startTime.hour": { $lte: endTime.hour } },
            { "startTime.minute": { $lte: endTime.minute } },
            { "endTime.hour": { $gte: endTime.hour } },
            { "endTime.minute": { $gte: endTime.minute } },
            { date: date }
          ]
        }
      ]
    });
  }

  async selectedShow(theaterIds: any[], currDate: Date) {
    return await showModel.aggregate([
      { $match: { theaterId: { $in: theaterIds }, date: { $gte: currDate } } },
      { $group: { _id: "$movieId" } },
      { $project: { _id: 0, movieId: "$_id" } }
    ]);
  }

  async selectedMovieShow(theaterIds: any[], movieId: string) {
    return await showModel.find({
      $and: [
        { theaterId: { $in: theaterIds } },
        { movieId: movieId }
      ]
    })
  }

  async findDatesUser(currDate: Date, theaterIds: any[], movieId: string) {
    return await showModel.distinct("date", {
      $and: [
        { theaterId: { $in: theaterIds } },
        { movieId: new ObjectId(movieId) }, // Convert movieId to ObjectId
        { date: { $gte: currDate } }
      ]
    });
  }

  async findFirstShowsUser(currDate: Date, theaterIds: any[], movieId: string) {
    // Set the time component of currDate to midnight
    const startOfDay = new Date(currDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Find shows for the current date
    return await showModel.find({
      $and: [
        { theaterId: { $in: theaterIds } },
        { movieId: new ObjectId(movieId) },
        { date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) } }
      ]
    }).populate('screenId')
  }

  async deleteShow(showId: ID): Promise<any> {
    return await showModel.findByIdAndDelete(showId)
  }

}