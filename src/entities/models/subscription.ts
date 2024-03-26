import mongoose, { Model, Schema, Document } from "mongoose";
import { ISubscription } from "../../interfaces/schema/subscriptionSchema";

export const SubscriptionSchema: Schema = new Schema<ISubscription & Document>({
    theaterId: {
        type: Schema.Types.ObjectId,
        required: [true, 'theaterId is required, screens can\'t exist in space :/'],
        ref: 'Theaters',
        readonly: true
    },
    billingId: {
        type: String,
    },
    plan: {
        type: String,
        enum: ['none','month','year'],
        default: 'none'
    },
    endDate: {
        type: Date,
        default: null
    }
})

export const subscriptionModel: Model<ISubscription & Document> = mongoose.model<ISubscription & Document>('Subscriptions', SubscriptionSchema)