import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SeederService } from './seeders/seeder.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [SeederService],
  exports: [PrismaModule],
})
export class DatabaseModule {}
