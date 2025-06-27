import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { ColoredProduct } from '../database/entities/colored-product.entity';
import { OrderStatusChange } from '../database/entities/order-status-change.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      ColoredProduct,
      OrderStatusChange,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
