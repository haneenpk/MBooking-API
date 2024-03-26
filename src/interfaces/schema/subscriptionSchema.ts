import { IApiRes, ID } from "../common";

export interface ISubscription {
    _id: ID
    theaterId: ID
    billingId: string
    plan: string
    endDate: Date
}

export interface IScreenRequirements extends Omit<ISubscription, '_id' > {}
export interface IApiSubscriptionRes extends IApiRes<ISubscription | null> {}
export interface IApiSubscriptionsRes extends IApiRes<ISubscription[] | null> {}