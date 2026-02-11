import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from './category/category.service';
import { CustomersService } from './customer/customer.service';
import { ProductsService } from './products/products.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly customersService: CustomersService,
    private readonly productsService: ProductsService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  // Esta función creará datos iniciales en tu base de datos de Supabase
  async seedDatabase() {
    try {
      this.logger.log('Iniciando el sembrado de datos...');

      // 1. Crear una Categoría inicial
      const category = await this.categoriesService.create({
        name: 'Electrónica'
      });
      this.logger.log(`Categoría creada: ${category.name} (ID: ${category.id})`);

      // 2. Crear un Cliente de prueba
      const customer = await this.customersService.create({
        name: 'Usuario de Prueba',
        email: 'test@example.com',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      this.logger.log(`Cliente creado: ${customer.name} (ID: ${customer.id})`);

      // Nota: No incluimos la creación de Producto aquí porque requiere 
      // un archivo Multer real para la imagen.

      return {
        message: 'Base de datos inicializada correctamente',
        categoryId: category.id,
        customerId: customer.id
      };
    } catch (error) {
      this.logger.error(`Error en el seeder: ${error.message}`);
      throw error;
    }
  }
}