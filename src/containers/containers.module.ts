import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContainersController } from './containers.controller';
import { ContainersService } from './containers.service';
import { Container } from '../database/entities/container.entity';
import { Product } from '../database/entities/product.entity';
import { ContainerProduct } from '../database/entities/container-product.entity';
import { ColoredProduct } from '../database/entities/colored-product.entity';
import { ContainerMovement } from '../database/entities/container-movement.entity';
import { StockMovement } from '../database/entities/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Container,
      Product,
      ContainerProduct,
      ColoredProduct,
      ContainerMovement,
      StockMovement,
    ]),
  ],
  controllers: [ContainersController],
  providers: [ContainersService],
  exports: [ContainersService],
})
export class ContainersModule {}
