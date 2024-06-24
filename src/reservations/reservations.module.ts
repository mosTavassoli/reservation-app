import { Module } from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { ReservationsController } from './controllers/reservations.controller';

@Module({
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
