import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsMatchWith(property: string, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isMatchWith',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return typeof value === 'string' && typeof relatedValue === 'string' && value === relatedValue;
				},
				defaultMessage() {
					return `${propertyName} must be match with '${property}'`;
				},
			},
		});
	};
}

export function IsContain(
	content: string,
	position: 'start' | 'middle' | 'end',
	validationOptions?: ValidationOptions,
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: {
				validate(value: any, args: ValidationArguments) {
					if (typeof value !== 'string') return false;

					if (position === 'start') {
						return value.startsWith(content);
					}

					if (position === 'middle') {
						return (
							value.includes(content) &&
							value.indexOf(content) > 0 &&
							value.indexOf(content) < value.length - content.length
						);
					}

					if (position === 'end') {
						return value.endsWith(content);
					}

					return false;
				},
				defaultMessage(validationArguments) {
					if (position == 'start') return `'${propertyName}' must start with '${content}'`;
					if (position == 'middle') return `'${propertyName}' must contain '${content}' in the middle`;
					if (position == 'end') return `'${propertyName}' must end with '${content}'`;
				},
			},
		});
	};
}

export function transformBool({ value }) {
	if (value === 'true') return true;
	if (value === 'false') return false;
	return value;
}

export const IsBool = () => {
	const toPlain = Transform(
		({ value }) => {
			return value;
		},
		{
			toPlainOnly: true,
		},
	);
	const toClass = (target: any, key: string) => {
		return Transform(
			({ obj }) => {
				return valueToBoolean(obj[key]);
			},
			{
				toClassOnly: true,
			},
		)(target, key);
	};
	return function (target: any, key: string) {
		toPlain(target, key);
		toClass(target, key);
	};
};

const valueToBoolean = (value: any) => {
	if (typeof value === 'boolean') {
		return value;
	}
	if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
		return true;
	}
	if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
		return false;
	}
	return undefined;
};
