import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  PaginatedReservation,
  ReservationDto,
  ReservationListDto,
  ReservationPaginatedQuery,
} from '../dto/reservations.dto';
import { PrismaService } from 'database/prisma/prisma.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Prisma } from '@prisma/client';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);
dayjs.extend(utc);

const RESERVATION_START_HOUR = 19;
const RESERVATION_END_HOUR = 23;

@Injectable()
export class ReservationsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(ReservationsService.name);

  createReservation = async (reservationRequest: ReservationDto) => {
    try {
      const { userId, tableId, reservedFrom } = reservationRequest;
      const [user, table] = await this.prismaService.$transaction([
        this.prismaService.user.findUnique({
          where: { id: userId },
        }),
        this.prismaService.table.findUnique({
          where: { id: tableId },
        }),
      ]);

      if (!user) {
        this.logger.error(`User with ID ${userId} does not exist.`);
        throw new BadRequestException(`User with ID ${userId} does not exist.`);
      }

      if (!table) {
        this.logger.error(`Table with ID ${tableId} does not exist.`);
        throw new BadRequestException(
          `Table with ID ${tableId} does not exist.`,
        );
      }

      const fromTime = dayjs.unix(reservedFrom).utc();
      const reservationHour = fromTime.hour();
      this.logger.debug(
        `Reservation Request: ${JSON.stringify(reservationRequest)}`,
      );
      this.logger.debug(`Formatted date: ${fromTime.toISOString()}`);
      const toTime = fromTime.add(1, 'hour');

      if (
        reservationHour < RESERVATION_START_HOUR ||
        reservationHour >= RESERVATION_END_HOUR
      ) {
        throw new BadRequestException(
          'Reservation times must be between 19:00 and 23:00 UTC to accommodate for 1-hour seating.',
        );
      }

      await this.checkForOverlappingReservations(tableId, fromTime, toTime);

      const reservation = await this.prismaService.reservation.create({
        data: {
          ...reservationRequest,
          reservedFrom: fromTime.utc().toDate(),
          reservedTo: toTime.utc().toDate(),
        },
      });

      this.logger.debug(
        `Reservation created successfully: ${JSON.stringify(reservation)}`,
      );

      return reservation;
    } catch (error) {
      this.logger.error(`Can not book the table. Try again`);
      throw error;
    }
  };

  private async checkForOverlappingReservations(
    tableId: number,
    fromTime: dayjs.Dayjs,
    toTime: dayjs.Dayjs,
  ): Promise<void> {
    const overlappingReservations = await this.prismaService.reservation.count({
      where: {
        tableId: tableId,
        AND: [
          {
            reservedFrom: {
              lt: toTime.toDate(),
            },
          },
          {
            reservedTo: {
              gt: fromTime.toDate(),
            },
          },
        ],
      },
    });

    if (overlappingReservations > 0) {
      throw new BadRequestException(
        'Unable to create reservation: table is already booked.',
      );
    }
  }

  paginateReservations = async (
    paginatedQuery: ReservationPaginatedQuery,
    startDate: number,
    endDate: number,
  ): Promise<PaginatedReservation> => {
    try {
      const defaultStartDate = dayjs().utc().subtract(30, 'day');
      const { page = 1, pageSize = 10 } = paginatedQuery;

      const startDateRange = dayjs
        .unix(startDate || defaultStartDate.unix())
        .utc()
        .toDate();
      const endDateRange = endDate
        ? dayjs.unix(endDate).utc().toDate()
        : undefined;

      this.logger.debug(
        `start date: ${startDateRange.toUTCString()} - end date: ${endDateRange ? endDateRange.toUTCString() : '-'}`,
      );
      const skip = (page - 1) * pageSize;

      let whereClause = Prisma.empty;

      if (endDateRange) {
        whereClause = Prisma.sql`WHERE reservedTo > ${startDateRange} AND reservedFrom < ${endDateRange}`;
      } else {
        whereClause = Prisma.sql`WHERE reservedTo > ${startDateRange}`;
      }

      const [reservations, total] = await Promise.all([
        this.prismaService.$queryRaw<ReservationListDto[]>(
          Prisma.sql`SELECT * FROM Reservation
          ${whereClause} 
          ORDER BY reservedFrom DESC
          LIMIT ${pageSize} OFFSET ${skip}
          `,
        ),
        this.prismaService.$queryRaw<[{ count: bigint }]>(
          Prisma.sql`
          SELECT COUNT(*) as count FROM Reservation
          ${whereClause} 
          `,
        ),
      ]);
      const count = Number(total[0].count);

      return {
        data: reservations,
        meta: {
          isFirstPage: page === 1,
          isLastPage: page * pageSize >= count,
          currentPage: page,
          nextPage: page * pageSize >= count ? null : page + 1,
          previousPage: page === 1 ? null : page - 1,
          pageCount: Math.ceil(count / pageSize),
          totalCount: count,
        },
      } as PaginatedReservation;
    } catch (error) {
      this.logger.error('Something wrong.');
      throw error;
    }
  };
}
