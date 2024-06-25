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
