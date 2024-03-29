import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mongo-user:8JuovLVuVvLVu68J@cluster0.raf7p.mongodb.net/smartranking?retryWrites=true&w=majority',
    ),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
