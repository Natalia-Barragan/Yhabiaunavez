import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private dataSource: DataSource,
  ) { }

  async create(dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });

        if (!product) {
          throw new BadRequestException(`Producto no encontrado: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Stock total insuficiente para ${product.name}`);
        }

        if (item.size && product.stockBySize && product.stockBySize[item.size] !== undefined) {
          if (product.stockBySize[item.size] < item.quantity) {
            throw new BadRequestException(`Stock insuficiente para el talle ${item.size} de ${product.name}`);
          }
          product.stockBySize[item.size] -= item.quantity;
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.price = product.price;
        orderItem.size = item.size ?? null;
        total += product.price * item.quantity;

        orderItems.push(orderItem);
      }

      const order = this.orderRepo.create({
        customerId: dto.customerId,
        total,
        items: orderItems,
      });

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (err) {
      console.error('CRITICAL: Order Creation Failed:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.orderRepo.find({
      relations: ['customer', 'items', 'items.product']
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException(`Orden ${id} no encontrada`);
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return await this.orderRepo.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
    return { deleted: true };
  }
}