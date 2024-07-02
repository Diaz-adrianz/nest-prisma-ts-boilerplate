import { SetMetadata } from '@nestjs/common';
import { constant } from 'src/config';

export const Public = () => SetMetadata(constant.DECORATORS.AUTH_PUBLIC, true);

export const Features = (...features: string[]) => SetMetadata(constant.DECORATORS.AUTH_FEATURE, features);
