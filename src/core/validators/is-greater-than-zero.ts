import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isGreaterThanZero', async: false })
export class IsGreaterThanZeroConstraint
  implements ValidatorConstraintInterface
{
  validate(value: number): boolean {
    return typeof value === 'number' && value > 0;
  }

  defaultMessage(): string {
    return '$property must be greater than zero';
  }
}

export function IsGreaterThanZero(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    if (typeof propertyName !== 'string') {
      throw new TypeError('IsGreaterThanZero requires a string property name');
    }
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsGreaterThanZeroConstraint,
    });
  };
}
