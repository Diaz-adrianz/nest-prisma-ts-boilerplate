import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as multer from 'multer';
import { Observable } from 'rxjs';
import { fileValidator, TfileExtensions } from './helper/file-validator.helper';

interface IuploadField {
	name: string;
	exts?: TfileExtensions[];
	fileType?: ('image' | 'video' | 'file')[];
	maxSize: number;
	maxCount?: number;
}

@Injectable()
export class UploaderInterceptor implements NestInterceptor {
	constructor(private readonly fields: IuploadField[]) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();

		const multerInstance = multer({
			storage: multer.memoryStorage(),
			fileFilter: (req, file, cb) => {
				const field = this.fields.find((v) => v.name === file.fieldname);

				try {
					fileValidator(file, { exts: field.exts, fileType: field.fileType, maxSize: field.maxSize });
					cb(null, true);
				} catch (error) {
					cb(error, false);
				}
			},
		}).fields(
			this.fields.map((field) => ({
				name: field.name,
				maxCount: field.maxCount ?? 1,
			})),
		);

		await new Promise((resolve, reject) => {
			multerInstance(request, response, async (err: any) => {
				if (err) return reject(err);

				this.fields.forEach((field) => {
					if (!field.maxCount || field.maxCount == 1) {
						request.files[field.name] = request.files[field.name][0];
					}
				});

				return resolve(true);
			});
		});

		return next.handle();
	}
}
