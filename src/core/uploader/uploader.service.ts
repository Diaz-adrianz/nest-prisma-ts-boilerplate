import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type TfileExtensions =
	| 'application/pdf'
	| 'application/msword'
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	| 'image/jpeg'
	| 'image/jpg'
	| 'image/png'
	| 'video/mp4'
	| 'video/webm';

export const fileExtensions = {
	image: ['image/jpeg', 'image/jpg', 'image/png'] as TfileExtensions[],
	video: ['video/mp4', 'video/webm'] as TfileExtensions[],
	file: [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	] as TfileExtensions[],
};

export interface IvalidateOptions {
	exts?: TfileExtensions[];
	fileType?: ('image' | 'video' | 'file')[];
	maxSize: number;
}

@Injectable()
export class UploaderService {
	constructor() {}

	validate(file: Express.Multer.File, options: IvalidateOptions) {
		let allowedMimes = [];

		if (options.exts) allowedMimes = [...allowedMimes, ...options.exts];
		if (options.fileType) options.fileType.forEach((typ) => allowedMimes.push(...fileExtensions[typ]));

		if (!allowedMimes.includes(file.mimetype))
			throw new BadRequestException(
				`Invalid file type for '${file.fieldname}'. Please upload only in ${allowedMimes.map((mim) => mim.split('/')[1]).join(', ')} format.`,
			);

		if (file.size > options.maxSize)
			throw new BadRequestException(
				`The '${file.fieldname}' exceeds the maximum allowed size of ${(options.maxSize / 1000 / 1000).toFixed(2)}MB`,
			);
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
}
