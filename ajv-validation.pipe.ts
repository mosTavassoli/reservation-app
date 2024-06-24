// ajv-validation.pipe.ts

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  private readonly schema: object;
  private readonly ajv: Ajv;
  private readonly validate: ValidateFunction;

  constructor(schema: object) {
    this.schema = schema;
    this.ajv = new Ajv({ allErrors: true, coerceTypes: true });
    addFormats(this.ajv);
    this.validate = this.ajv.compile(schema);
  }

  transform(value: any) {
    const valid = this.validate(value);

    if (!valid) {
      const errors = this.formatErrors(this.validate.errors);
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    return value;
  }

  private formatErrors(errors: ErrorObject[] | null | undefined): string {
    if (!errors) return '';
    return errors.map((err) => `${err.instancePath} ${err.message}`).join(', ');
  }
}
