import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from 'database/database.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [UsersModule, DatabaseModule, ReservationsModule, TablesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
