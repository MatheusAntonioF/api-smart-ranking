import * as Mongoose from 'mongoose';

export const MatchSchema = new Mongoose.Schema(
  {
    ref: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    result: [
      {
        set: String,
      },
    ],
    players: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  { timestamps: true, collection: 'match' },
);
