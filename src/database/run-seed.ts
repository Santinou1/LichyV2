import { DataSource } from 'typeorm';
import { DefaultDataSeed } from './seeds/default-data.seed';
import { envConfig } from '../config/env.config';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: envConfig.database.host,
    port: envConfig.database.port,
    username: envConfig.database.username,
    password: envConfig.database.password,
    database: envConfig.database.database,
    entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const seeder = new DefaultDataSeed(dataSource);
    await seeder.run();

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed(); 