import { BadRequestException } from '@nestjs/common';

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

export function fileValidator(file: Express.Multer.File, options: IvalidateOptions) {
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
