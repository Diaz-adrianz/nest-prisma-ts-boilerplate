import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from 'src/lib/logger/logger.service';
import { fileValidator, IvalidateOptions } from './helper/file-validator.helper';

@Injectable()
export class UploaderService {
	constructor(private logger?: LoggerService) {}

	validate(file: Express.Multer.File, options: IvalidateOptions) {
		return fileValidator(file, options);
	}

	editFileName(originalName: string, feature?: string) {
		const ext = path.extname(originalName);
		const name = path.basename(originalName, ext);
		return `${Date.now()}-${feature ? `$${feature}-` : ''}${name}${ext}`;
	}

	saveToDisk(file: Express.Multer.File, folder?: string, feature?: string) {
		const uploadFolder = './uploads' + (folder ?? '');

		if (!fs.existsSync(uploadFolder)) {
			fs.mkdirSync(uploadFolder, { recursive: true });
		}

		const filename = this.editFileName(file.originalname, feature);
		const filePath = path.join(uploadFolder, filename);

		fs.writeFileSync(filePath, file.buffer);

		return {
			fieldname: file.fieldname,
			originalname: file.originalname,
			encoding: file.encoding,
			mimetype: file.mimetype,
			destination: uploadFolder,
			filename: filename,
			path: filePath,
			size: file.size,
		};
	}

	deleteFromDisk(path: string) {
		fs.unlink(path, (err) => {
			if (err) this.logger.error(err);
		});
	}
}
