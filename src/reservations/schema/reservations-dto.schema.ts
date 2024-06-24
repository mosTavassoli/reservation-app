export const ReservationDtoSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    tableId: { type: 'number' },
    reservedFrom: { type: 'number' },
  },
  required: ['userId', 'tableId', 'reservedFrom'],
  additionalProperties: false,
};

export const ReservationDateRangeSchema = {
  type: 'object',
  properties: {
    startDate: { type: 'number', require: false },
    endDate: { type: 'number', require: false },
  },
  additionalProperties: false,
};
