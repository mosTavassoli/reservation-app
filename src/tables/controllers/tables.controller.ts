import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TablesService } from '../services/tables.service';
import { TableDto } from '../dto/tables.dto';

@Controller('tables')
@ApiTags('Tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all tables',
    operationId: 'getAllTables',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOkResponse({
    description: 'Return the list of reservations.',
    type: [TableDto],
  })
  async getAllTables(): Promise<TableDto[]> {
    return await this.tablesService.getAllTables();
  }
}
