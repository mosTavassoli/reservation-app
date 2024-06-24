export class ReservationDto {
  userId: number;
  tableId: number;
  reservedFrom: number;
}

export class ReservationListDto {
  id: number;
  userId: number;
  tableId: number;
  reservedFrom: Date;
  reservedTo: Date;
}

export class ReservationPaginatedQuery {
  page?: number = 1;
  pageSize?: number = 10;
}

export class ReservationDateRange {
  startDate: number;
  endDate: number;
}

export class PaginatedReservation {
  data: ReservationListDto[];
  meta: PaginationMetaEntity;
}

export class PaginationMetaEntity {
  pageCount: number;
  totalCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
}
