import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerService {
	constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

	info(message: any) {
		this.logger.info(message);
	}

	error(message: any) {
		this.logger.error(message);
	}

	warn(message: any) {
		this.logger.warn(message);
	}

	debug(message: any) {
		this.logger.debug(message);
	}

	verbose(message: any) {
		this.logger.verbose(message);
	}
}
