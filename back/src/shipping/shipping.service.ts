import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private cachedToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private configService: ConfigService
  ) {}

  private getEnvConfig() {
    const user = this.configService.get<string>('CORREO_ARGENTINO_USER');
    const pass = this.configService.get<string>('CORREO_ARGENTINO_PASS');
    const customerId = this.configService.get<string>('CORREO_ARGENTINO_CUSTOMER_ID');
    const env = this.configService.get<string>('CORREO_ARGENTINO_ENV') || 'prod';

    if (!user || !pass || !customerId) {
      throw new BadRequestException('Las credenciales de Correo Argentino no están completamente configuradas en el servidor (.env).');
    }

    const baseUrl = env === 'prod' 
      ? 'https://api.correoargentino.com.ar/micorreo/v1' 
      : 'https://apitest.correoargentino.com.ar/micorreo/v1';

    return { user, pass, customerId, baseUrl };
  }

  private async getToken(): Promise<string> {
    if (this.cachedToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {
      return this.cachedToken;
    }

    const { user, pass, baseUrl } = this.getEnvConfig();
    const authHeader = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

    this.logger.log(`Obteniendo nuevo token de Correo Argentino (${baseUrl})...`);

    try {
      const response = await fetch(`${baseUrl}/token`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Length': '0'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fallo al autenticar contra Correo Argentino: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as { token: string; expire?: string };
      this.cachedToken = data.token;
      
      // Expira en 10 minutos para evitar cualquier inconveniente con desfases de hora local
      this.tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      this.logger.log('Token de Correo Argentino obtenido exitosamente.');
      return this.cachedToken;
    } catch (error: any) {
      this.logger.error(`Error al obtener token de Correo Argentino: ${error.message}`);
      throw new BadRequestException(`Error de autenticación con el proveedor de envíos: ${error.message}`);
    }
  }

  async calculateRates(dto: CalculateShippingDto) {
    const { customerId, baseUrl } = this.getEnvConfig();
    const token = await this.getToken();

    // Calcular peso y dimensiones consolidando la cantidad de productos
    let totalWeight = 0;
    let quantityTotal = 0;

    if (dto.items && dto.items.length > 0) {
      for (const item of dto.items) {
        quantityTotal += item.quantity;
        
        // Buscar el producto en la base de datos para obtener su peso real
        try {
          const product = await this.productRepository.findOne({ where: { id: item.productId } });
          const productWeight = product && product.weight !== undefined ? product.weight : 300;
          totalWeight += productWeight * item.quantity;
        } catch (dbError: any) {
          this.logger.error(`Error al buscar producto ${item.productId} en DB para cotización: ${dbError.message}`);
          totalWeight += 300 * item.quantity; // Fallback a 300g si hay error
        }
      }
    } else {
      quantityTotal = 1; // Default
      totalWeight = 300;
    }

    // Heurística de embalaje para ropa/objetos:
    // - Las prendas se apilan: alto = cantidad * 3cm (mínimo 5cm)
    // - Caja estándar: ancho = 20cm, largo = 25cm
    const packageHeight = Math.max(5, quantityTotal * 3);
    const packageWidth = 20;
    const packageLength = 25;

    const payload = {
      customerId,
      postalCodeOrigin: '1900', // Código postal de origen (La Plata)
      postalCodeDestination: dto.postalCodeDestination,
      dimensions: {
        weight: totalWeight,
        height: packageHeight,
        width: packageWidth,
        length: packageLength
      }
    };

    this.logger.log(`Cotizando envío para CP destino ${dto.postalCodeDestination} con payload: ${JSON.stringify(payload)}`);

    try {
      const response = await fetch(`${baseUrl}/rates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la llamada de cotización: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      this.logger.error(`Error al cotizar envío en Correo Argentino: ${error.message}`);
      throw new BadRequestException(`No se pudo cotizar el envío con Correo Argentino: ${error.message}`);
    }
  }
}
