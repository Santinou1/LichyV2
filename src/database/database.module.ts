import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entidades
import { User } from './entities/user.entity';
import { Container } from './entities/container.entity';
import { Product } from './entities/product.entity';
import { ColoredProduct } from './entities/colored-product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { ContainerMovement } from './entities/container-movement.entity';
import { OrderStatusChange } from './entities/order-status-change.entity';
import { ContainerProduct } from './entities/container-product.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'lichy'),
        entities: [
          User, 
          Container, 
          Product, 
          ColoredProduct, 
          Order, 
          OrderItem, 
          StockMovement,
          ContainerMovement,
          OrderStatusChange,
          ContainerProduct
        ],
        synchronize: configService.get('NODE_ENV') !== 'production', // Solo en desarrollo
        logging: configService.get('NODE_ENV') !== 'production',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Container,
      Product,
      ColoredProduct,
      Order,
      OrderItem,
      StockMovement,
      ContainerMovement,
      OrderStatusChange,
      ContainerProduct
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
