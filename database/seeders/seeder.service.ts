import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'database/prisma/prisma.service';
import { tables } from './data/table';

@Injectable()
export class SeederService {
  logger = new Logger(SeederService.name);
  constructor(private readonly prismaService: PrismaService) {}
  async seed() {
    this.logger.log('Seeding the database...');

    tables.map(
      async (table) =>
        await this.prismaService.table.upsert({
          where: {
            id: table.id,
          },
          create: table,
          update: table,
        }),
    );

    this.logger.log('Database seeded');
  }
}
