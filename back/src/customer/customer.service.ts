import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async create(dto: CreateCustomerDto) {
    // Verificamos si el email ya existe
    const existing = await this.customerRepository.findOne({ where: { email: dto.email } });

    if (existing) {
      // Si el cliente ya existe, actualizamos su información (upsert)
      // Esto evita el error "correo ya registrado" y mantiene los datos al día
      Object.assign(existing, dto);
      return await this.customerRepository.save(existing);
    }

    const customer = this.customerRepository.create(dto);
    return await this.customerRepository.save(customer);
  }

  async findAll() {
    return await this.customerRepository.find();
  }

  async findByEmail(email: string) {
    return await this.customerRepository.findOne({ where: { email } });
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['orders'] // Traemos sus órdenes para ver el historial
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    // Fusionamos los cambios del DTO
    Object.assign(customer, dto);

    return await this.customerRepository.save(customer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
    return { message: `Cliente ${id} eliminado`, deleted: true };
  }
}