import { DataSource } from 'typeorm';
import { Container } from '../entities/container.entity';
import { User } from '../entities/user.entity';
import { ContainerCategory, ContainerLocation, UserRole } from '../entities/enums';

export class DefaultDataSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    await this.seedUsers();
    await this.seedContainers();
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    
    // Verificar si ya existen usuarios
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already seeded, skipping...');
      return;
    }

    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@lichytex.com',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', // admin123
        firstName: 'Administrador',
        lastName: 'Sistema',
        role: UserRole.ADMIN,
      },
      {
        username: 'logistica',
        email: 'logistica@lichytex.com',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', // logistica123
        firstName: 'Usuario',
        lastName: 'Logística',
        role: UserRole.LOGISTICA,
      },
      {
        username: 'deposito',
        email: 'deposito@lichytex.com',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', // deposito123
        firstName: 'Usuario',
        lastName: 'Depósito',
        role: UserRole.DEPOSITO,
      },
      {
        username: 'ventas',
        email: 'ventas@lichytex.com',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', // ventas123
        firstName: 'Usuario',
        lastName: 'Ventas',
        role: UserRole.VENTAS,
      },
    ];

    await userRepository.save(defaultUsers);
    console.log('Default users seeded successfully');
  }

  private async seedContainers() {
    const containerRepository = this.dataSource.getRepository(Container);
    
    // Verificar si ya existen contenedores
    const existingContainers = await containerRepository.count();
    if (existingContainers > 0) {
      console.log('Containers already seeded, skipping...');
      return;
    }

    const defaultContainers = [
      {
        code: 'MITRE-001',
        supplier: 'Lichytex',
        category: ContainerCategory.EN_STOCK,
        location: ContainerLocation.MITRE,
        notes: 'Contenedor inicial del depósito Mitre',
      },
      {
        code: 'LICHY-001',
        supplier: 'Lichytex',
        category: ContainerCategory.EN_STOCK,
        location: ContainerLocation.LICHY,
        notes: 'Contenedor inicial del depósito Lichy',
      },
    ];

    await containerRepository.save(defaultContainers);
    console.log('Default containers seeded successfully');
  }
} 