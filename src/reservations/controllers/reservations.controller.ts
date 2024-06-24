import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  PaginatedReservation,
  ReservationDto,
  ReservationListDto,
  ReservationPaginatedQuery,
} from '../dto/reservations.dto';
import { ReservationsService } from '../services/reservations.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AjvValidationPipe } from 'ajv-validation.pipe';
import { ReservationDtoSchema } from '../schema/reservations-dto.schema';

@Controller('reservations')
@ApiTags('Reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('')
  @ApiOperation({
    summary: 'Create Reservation',
    operationId: 'createReservation',
  })
  @ApiCreatedResponse({
    description: 'Reservation created successfully.',
    type: ReservationListDto,
  })
  @ApiBody({
    type: ReservationDto,
    required: true,
    description: 'reservedFrom is timestamp',
  })
  @ApiBadRequestResponse({ description: 'Reservation can not be created.' })
  async createReservation(
    @Body(new AjvValidationPipe(ReservationDtoSchema))
    reservationRequest: ReservationDto,
  ) {
    return await this.reservationsService.createReservation(reservationRequest);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all reservations',
    operationId: 'getReservations',
  })
  @ApiOkResponse({
    description: 'Return the list of reservations.',
    type: PaginatedReservation,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'number', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    schema: { type: 'number', minimum: 1, default: 10 },
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'timestamp',
    schema: { type: 'number', example: '1718924419' },
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'timestamp',
    schema: { type: 'number', example: '1719097219' },
  })
  async getReservations(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize: number,
    @Query('startDate', new ParseIntPipe({ optional: true })) startDate: number,
    @Query('endDate', new ParseIntPipe({ optional: true })) endDate: number,
  ): Promise<PaginatedReservation> {
    const paginatedQuery: ReservationPaginatedQuery = { page, pageSize };

    return await this.reservationsService.paginateReservations(
      paginatedQuery,
      startDate,
      endDate,
    );
  }
}
