import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BrowseDto } from 'src/helper/dto/browse.dto';
import { paginateResponse, successResponse } from 'src/helper/response.helper';

@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	create(@Body() createRoleDto: CreateRoleDto) {
		const data = this.roleService.create(createRoleDto);
		return successResponse(data, 'Role created successfully');
	}

	@Get('browse')
	async findAll(@Query() browseDto: BrowseDto) {
		const { result, count } = await this.roleService.findAll(browseDto);
		return successResponse(
			browseDto.paginate ? paginateResponse(result, count, browseDto) : result,
			'Roles retrieved successfuly',
		);
	}

	@Get('get/:id')
	async findOne(@Param('id') id: string) {
		const data = await this.roleService.findOne(id);
		return successResponse(data, 'Role retrieved successfuly');
	}

	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		const data = await this.roleService.update(id, updateRoleDto);
		return successResponse(data, 'Role updated successfully');
	}

	@Delete('delete/:ids')
	async remove(@Param('ids') ids: string, @Query('hard') hard: boolean) {
		const data = await this.roleService.remove(ids.split(','), hard);
		return successResponse(null, `${data.count ? data.count + ' roles' : 'Role'} deleted successfully`);
	}

	@Patch('restore/:ids')
	async restore(@Param('ids') ids: string) {
		const data = await this.roleService.restore(ids.split(','));
		return successResponse(null, `${data.count ? data.count + ' roles' : 'Role'} restored successfully`);
	}
}
