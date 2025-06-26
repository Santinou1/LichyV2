# 🗄️ Configuración de Base de Datos - Lichytex

## 📋 Requisitos Previos

1. **MySQL Server** instalado y ejecutándose
2. **Node.js** y **npm** instalados

## 🔧 Configuración de la Base de Datos

### 1. Crear la Base de Datos

```sql
CREATE DATABASE lichytex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password_aqui
DB_DATABASE=lichytex

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar Migraciones y Seeder

```bash
# Ejecutar el seeder para crear datos por defecto
npm run seed
```

## 🏗️ Estructura de la Base de Datos

### Entidades Principales

1. **Users** - Usuarios del sistema con roles
2. **Containers** - Contenedores con estados y ubicaciones
3. **Products** - Productos con cantidades globales
4. **ColoredProducts** - Productos distribuidos por colores
5. **Orders** - Pedidos de clientes
6. **OrderItems** - Items de cada pedido
7. **StockMovements** - Movimientos de stock con trazabilidad completa

### 🎯 Manejo de Decimales de Alta Precisión

El sistema está optimizado para manejar cantidades muy precisas:

#### **Cantidades de Productos**
- **Precisión:** 25 dígitos totales, 8 decimales
- **Ejemplos:** 20000.12345678 metros, 1500.98765432 kg
- **Campos:** `totalQuantity`, `availableQuantity`, `reservedQuantity`, `soldQuantity`

#### **Valores Monetarios**
- **Precisión:** 25 dígitos totales, 6 decimales
- **Ejemplos:** 1234567.123456 USD, 987654.987654 EUR
- **Campos:** `totalAmount`, `unitPrice`, `totalValue`, `fob`

#### **Precios Unitarios**
- **Precisión:** 20 dígitos totales, 6 decimales
- **Ejemplos:** 12.345678 USD/m, 45.987654 USD/kg
- **Campos:** `unitPrice`, `unitCost`

#### **Porcentajes**
- **Precisión:** 5 dígitos totales, 2 decimales
- **Ejemplos:** 21.00%, 5.50%
- **Campos:** `taxRate`, `discountPercentage`

### Estados de Contenedores

- **COMPRADO** → **EMBARCADO** → **ARRIBADO** → **DEPOSITO_NACIONAL** → **EN_STOCK** → **ENTREGADO**

### Ubicaciones Disponibles

- **MITRE** - Depósito Mitre
- **LICHY** - Depósito Lichy
- **LAVALLE** - Depósito Lavalle
- Y otras ubicaciones intermedias según el flujo

## 👥 Usuarios por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| logistica | logistica123 | Logística |
| deposito | deposito123 | Depósito |
| ventas | ventas123 | Ventas |

## 🚀 Iniciar la Aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

## 📊 Verificar Instalación

1. La aplicación debería estar corriendo en `http://localhost:3000`
2. Verificar que las tablas se crearon correctamente en MySQL

## 🔍 Troubleshooting

### Error de Conexión a MySQL
- Verificar que MySQL esté ejecutándose
- Verificar credenciales en `.env`
- Verificar que la base de datos `lichytex` exista

### Error de Permisos
- Verificar que el usuario MySQL tenga permisos en la base de datos
- Ejecutar: `GRANT ALL PRIVILEGES ON lichytex.* TO 'tu_usuario'@'localhost';`

### Errores de Precisión Decimal
- MySQL debe soportar DECIMAL con alta precisión
- Verificar versión de MySQL (recomendado 8.0+)
- Las cantidades se almacenan como DECIMAL(25,8) para máxima precisión

## 📈 Ventajas del Sistema de Decimales

1. **Precisión Extrema:** Manejo de cantidades muy pequeñas sin pérdida de precisión
2. **Trazabilidad Completa:** Todos los movimientos se registran con precisión
3. **Cálculos Exactos:** Sin errores de redondeo en operaciones financieras
4. **Auditoría:** Historial completo de cambios en stock
5. **Flexibilidad:** Soporte para diferentes unidades y conversiones 