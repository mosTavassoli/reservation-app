import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'database/prisma/prisma.service';
import { TableDto, TableEntity } from '../dto/tables.dto';

@Injectable()
export class TablesService {
  constructor(private prismaService: PrismaService) {}
  private readonly logger = new Logger(TablesService.name);

  async getAllTables(): Promise<TableDto[]> {
    const tables: TableEntity[] = await this.prismaService.table.findMany();
    this.logger.debug(`Tables: ${JSON.stringify(tables)}`);

    return tables.map((table) => ({
      id: table.id,
      seats: table.seats,
    }));
  }
}
