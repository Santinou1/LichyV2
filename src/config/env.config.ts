export const envConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lichy',
  },
  app: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  // Configuraciones específicas para manejo de decimales
  decimals: {
    // Precisión para cantidades de productos (metros, kg, unidades)
    quantityPrecision: 25,
    quantityScale: 8,
    
    // Precisión para valores monetarios
    moneyPrecision: 25,
    moneyScale: 6,
    
    // Precisión para precios unitarios
    unitPricePrecision: 20,
    unitPriceScale: 6,
    
    // Precisión para porcentajes
    percentagePrecision: 5,
    percentageScale: 2,
    
    // Precisión para FOB y costos
    costPrecision: 20,
    costScale: 6,
  },
}; 