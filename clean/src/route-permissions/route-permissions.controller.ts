import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoutePermissionsService } from './route-permissions.service';
import { CreateRoutePermissionDto } from './dto/create-route-permission.dto';
import { UpdateRoutePermissionDto } from './dto/update-route-permission.dto';

@Controller('route-permissions')
export class RoutePermissionsController {
  constructor(
    private readonly routePermissionsService: RoutePermissionsService,
  ) {}

  @Post()
  create(@Body() createRoutePermissionDto: CreateRoutePermissionDto) {
    return this.routePermissionsService.create(createRoutePermissionDto);
  }

  @Get()
  findAll() {
    return this.routePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routePermissionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoutePermissionDto: UpdateRoutePermissionDto,
  ) {
    return this.routePermissionsService.update(+id, updateRoutePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routePermissionsService.remove(+id);
  }
}
