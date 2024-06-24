export const UserDtoSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 250 },
    email: { type: 'string', format: 'email' },
  },
  required: ['name', 'email'],
  additionalProperties: false,
};
