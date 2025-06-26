import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe 
} from '@nestjs/common';
import { ContainersService } from './containers.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { ChangeContainerStatusDto } from './dto/change-container-status.dto';

@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post()
  create(@Body() createContainerDto: CreateContainerDto) {
    return this.containersService.create(createContainerDto);
  }

  @Get()
  findAll() {
    return this.containersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.containersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateContainerDto: UpdateContainerDto
  ) {
    return this.containersService.update(id, updateContainerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.containersService.remove(id);
  }

  @Post(':id/change-status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeContainerStatusDto
  ) {
    // TODO: Obtener userId del JWT token cuando implementemos auth
    const userId = 1; // Temporal
    return this.containersService.changeStatus(id, changeStatusDto, userId);
  }

  @Get(':id/movements')
  getMovementHistory(@Param('id', ParseIntPipe) id: number) {
    return this.containersService.getMovementHistory(id);
  }
}
