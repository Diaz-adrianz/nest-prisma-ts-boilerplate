import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UploadedFile,
	Put,
	UseInterceptors,
	Req,
	UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BrowseDto } from 'src/helper/dto/browse.dto';
import { paginateResponse, successResponse } from 'src/helper/response.helper';
import { ClientService } from 'src/lib/client/client.service';
import { UploaderInterceptor } from '../uploader/uploader.interceptor';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly client: ClientService,
	) {}

	@Post('create')
	async create(@Body() createUserDto: CreateUserDto) {
		const data = await this.userService.create(createUserDto);
		return successResponse(data, 'User created successfully');
	}

	@Get('browse')
	async findAll(@Query() browseDto: BrowseDto) {
		const { result, count } = await this.userService.findAll(browseDto);

		return successResponse(
			browseDto.paginate ? paginateResponse(result, count, browseDto) : result,
			'Users retrieved successfully',
		);
	}

	@Get('get/:id')
	async findOne(@Param('id') id: string) {
		const data = await this.userService.findOne(id);
		return successResponse(data, 'User retrieved successfully');
	}

	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		const data = await this.userService.update(id, updateUserDto);
		return successResponse(data, 'User updated sucessfully');
	}

	@Delete('delete/:ids')
	async remove(@Param('ids') ids: string, @Query('hard') hard: boolean) {
		const data = await this.userService.remove(ids.split(','), hard);
		return successResponse(null, `${data.count ? data.count + ' roles' : 'Role'} deleted successfully`);
	}

	@Patch('restore/:ids')
	async restore(@Param('ids') ids: string) {
		const data = await this.userService.restore(ids.split(','));
		return successResponse(null, `${data.count ? data.count + ' roles' : 'Role'} restored successfully`);
	}

	@Get('me')
	async findMyProfile() {
		const { id } = this.client.getUser();
		const data = await this.userService.findOne(id);
		return successResponse(data, 'User retrieved successfully');
	}

	@Put('me/update-photo')
	@UseInterceptors(new UploaderInterceptor([{ name: 'photo', maxSize: 3 * 1000 * 1000, fileType: ['image'] }]))
	async updatePhoto(@UploadedFiles() files: { photo?: Express.Multer.File }) {
		const { id } = this.client.getUser();
		this.userService.updatePhoto(id, files.photo);
		return successResponse(null, 'New profile photo saved');
	}
}
