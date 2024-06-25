import { Module } from '@nestjs/common';
import { TablesService } from './services/tables.service';
import { TablesController } from './controllers/tables.controller';

@Module({
  providers: [TablesService],
  controllers: [TablesController],
})
export class TablesModule {}
