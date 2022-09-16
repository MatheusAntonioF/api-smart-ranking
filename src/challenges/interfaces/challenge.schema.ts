import * as Mongoose from 'mongoose';

export const ChallengeSchema = new Mongoose.Schema(
  {
    date: Date,
    dateTimeChallenge: Date,
    status: String,
    category: String,
    challenger: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    players: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  { timestamps: true, collection: 'challenges' },
);
