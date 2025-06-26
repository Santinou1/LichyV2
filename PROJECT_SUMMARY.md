# Lichytex - Sistema de Gestión de Almacenes Textiles

## Resumen del Proyecto

Este es un sistema de gestión de almacenes para Lichytex, una empresa mayorista textil con dos almacenes físicos. El sistema está desarrollado en **NestJS con TypeScript** y utiliza **MySQL** como base de datos.

## Arquitectura del Sistema

### Tecnologías Utilizadas
- **Backend**: NestJS + TypeScript
- **Base de Datos**: MySQL
- **ORM**: TypeORM
- **Autenticación**: JWT (pendiente de implementar)
- **Validación**: class-validator, class-transformer

### Estructura de Módulos
```
src/
├── app.module.ts (módulo principal)
├── config/ (configuración de entorno)
├── database/ (entidades y configuración de BD)
├── users/ (gestión de usuarios)
├── containers/ (gestión de contenedores)
├── products/ (gestión de productos - pendiente)
└── orders/ (gestión de pedidos - pendiente)
```

## Entidades de Base de Datos

### 1. User (Usuario)
- **Campos**: id, username, email, password, role, createdAt, updatedAt
- **Roles**: ADMIN, WAREHOUSE_MANAGER, OPERATOR, VIEWER
- **Relaciones**: One-to-Many con movimientos de stock, contenedores y pedidos

### 2. Container (Contenedor)
- **Campos**: id, name, description, status, location, createdAt, updatedAt
- **Estados**: AVAILABLE, IN_USE, MAINTENANCE, RETIRED
- **Relaciones**: Many-to-Many con productos (a través de ContainerProduct)

### 3. Product (Producto)
- **Campos**: id, name, description, mainUnit, alternativeUnit, createdAt, updatedAt
- **Unidades**: M, KG, UNI
- **Relaciones**: Many-to-Many con contenedores

### 4. ContainerProduct (Producto en Contenedor)
- **Campos**: id, containerId, productId, quantity, coloredQuantity, createdAt, updatedAt
- **Función**: Tabla de unión para relación Many-to-Many

### 5. ColoredProduct (Producto Coloreado)
- **Campos**: id, containerProductId, color, quantity, createdAt, updatedAt
- **Función**: Distribución de productos por colores

### 6. Order (Pedido)
- **Campos**: id, customerName, customerEmail, status, totalAmount, createdAt, updatedAt
- **Estados**: PENDING, CONFIRMED, IN_PRODUCTION, READY, SHIPPED, DELIVERED, CANCELLED
- **Relaciones**: One-to-Many con OrderItem

### 7. OrderItem (Item de Pedido)
- **Campos**: id, orderId, productId, quantity, unitPrice, totalPrice, createdAt, updatedAt

### 8. StockMovement (Movimiento de Stock)
- **Campos**: id, containerId, productId, type, quantity, comment, userId, createdAt
- **Tipos**: IN, OUT, ADJUSTMENT
- **Comentarios**: **OBLIGATORIOS** para todos los movimientos

### 9. ContainerMovement (Movimiento de Contenedor)
- **Campos**: id, containerId, fromLocation, toLocation, comment, userId, createdAt
- **Comentarios**: **OBLIGATORIOS** para todos los movimientos

### 10. OrderStatusChange (Cambio de Estado de Pedido)
- **Campos**: id, orderId, fromStatus, toStatus, comment, userId, createdAt
- **Comentarios**: **OBLIGATORIOS** para todos los cambios

## Endpoints Implementados

### Prefijo Global: `/api`

#### Usuarios (`/api/users`)
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

#### Contenedores (`/api/containers`)
- `GET /api/containers` - Obtener todos los contenedores
- `GET /api/containers/:id` - Obtener contenedor por ID
- `POST /api/containers` - Crear nuevo contenedor
- `PUT /api/containers/:id` - Actualizar contenedor
- `DELETE /api/containers/:id` - Eliminar contenedor
- `PATCH /api/containers/:id/status` - Cambiar estado del contenedor
- `POST /api/containers/:id/products` - Asignar productos al contenedor
- `POST /api/containers/:id/distribute-colors` - Distribuir productos por colores

### DTOs Implementados

#### Usuarios
- `CreateUserDto`: username, email, password, role
- `UpdateUserDto`: username, email, password, role (todos opcionales)

#### Contenedores
- `CreateContainerDto`: name, description, status, location, products (array de productos)
- `UpdateContainerDto`: name, description, status, location (todos opcionales)
- `ChangeContainerStatusDto`: status, comment (obligatorio)
- `DistributeProductsDto`: distributions (array de distribuciones por color)

## Funcionalidades Implementadas

### 1. Gestión de Usuarios
- CRUD completo de usuarios
- Roles de usuario definidos
- Validación de datos con class-validator

### 2. Gestión de Contenedores
- CRUD completo de contenedores
- Gestión de estados (AVAILABLE, IN_USE, MAINTENANCE, RETIRED)
- Asignación de productos con creación automática
- Distribución de productos por colores
- **Comentarios obligatorios** en cambios de estado

### 3. Lógica de Negocio
- **Creación automática de productos**: Al crear un contenedor, se crean automáticamente los productos asociados
- **Unidades por defecto**: 
  - M o KG → ROLLOS como unidad alternativa
  - UNI → CAJAS como unidad alternativa
- **Relación Many-to-Many**: Un producto puede estar en múltiples contenedores y viceversa

## Configuración de Base de Datos

### Variables de Entorno Requeridas
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=lichytex
```

### Precisión Decimal
- **Cantidades**: DECIMAL(10,3) - permite hasta 3 decimales
- **Precios**: DECIMAL(10,2) - permite hasta 2 decimales

### Seeder de Datos
- Archivo: `src/database/run-seed.ts`
- Crea datos por defecto para testing
- Ejecutar con: `npm run seed`

## Pasos Futuros (Roadmap)


🚀 Plan de Implementación de Módulo de Pedidos (Orders)

🧩 Fase 1: Base del módulo de pedidos
Crear el servicio y controlador

OrdersService

OrdersController

Definir DTOs

Crear DTOs para:

Crear pedidos

Agregar productos a pedidos

Confirmar cantidades enviadas

Lógica principal

Permitir la creación de pedidos a partir de productos coloreados (ColoredProduct).

Validar cantidades disponibles.

🔄 Fase 2: Flujo completo de pedidos

📦 Crear pedido desde productos coloreados

Un pedido puede incluir productos de uno o varios contenedores.

No es obligatorio agrupar múltiples contenedores en un mismo pedido.

✅ Confirmación del pedido
El usuario puede ingresar una cantidad estimada al crear el pedido (ej: 3000 m de Lana Azul).

Luego, al confirmar el pedido, se puede ajustar la cantidad real (ej: 3050 m o 2900 m).

Aplica a todas las unidades: M, KG, UNI y también a unidades alternativas (cajas/rollos).

📍 Asignar el pedido a un depósito
Se debe permitir elegir destino: MITRE o LICHY.

En ese depósito, el pedido y sus productos deben estar visibles.

🧾 Ejemplo de endpoint
POST /api/orders/{orderId}/add-items
json
Copiar
Editar
{
  "items": [
    {
      "coloredProductId": 1,
      "quantity": 100.00,
      "unitPrice": 15.50
    },
    {
      "coloredProductId": 5,
      "quantity": 200.00,
      "unitPrice": 12.75
    }
  ]
}
📝 Si {orderId} no existe, el backend debe crear automáticamente un nuevo pedido antes de agregar los ítems.

🎛️ Funcionalidad clave: Enviar productos desde un contenedor a un pedido
Cuando estás en la vista de detalles de un contenedor, se listan los productos que contiene. Ejemplo:

Producto: LANA AZUL
Cantidad disponible: 1.000 metros / 40 rollos

✨ Botón: “Enviar a…”
Al lado de cada producto debe haber un botón llamado “Enviar a…”.

Al hacer clic:
Se abre un modal con las siguientes opciones:

1. Seleccionar cantidades a enviar
Se ingresan manualmente:

400 metros

20 rollos

2. Elegir destino del pedido
✅ Crear nuevo pedido
Se genera un pedido en estado "Pendiente" con ese producto.

📋 Agregar a pedido existente
Se muestra una lista de pedidos abiertos y compatibles.

El usuario selecciona uno y se agrega el producto.




## Reglas de Negocio Importantes

### 1. Comentarios Obligatorios
- **Todos los movimientos de stock** requieren comentario
- **Todos los movimientos de contenedores** requieren comentario
- **Todos los cambios de estado de pedidos** requieren comentario

### 2. Trazabilidad
- Todos los cambios deben registrar el usuario que los realizó
- Timestamps automáticos en todas las entidades
- Historial completo de cambios

### 3. Validaciones
- No permitir cantidades negativas
- Validar disponibilidad antes de movimientos
- Verificar permisos por rol

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start:dev

# Ejecutar seeder
npm run seed

# Compilar
npm run build

# Ejecutar en producción
npm run start:prod
```

## Estructura de Almacenes

### Almacén 1
- Ubicación: Mitre


### Almacén 2
- Ubicación: Lichy


## Notas para el Desarrollo

1. **Siempre usar comentarios** en movimientos y cambios de estado
2. **Validar permisos** antes de operaciones críticas
3. **Mantener trazabilidad** en todas las operaciones
4. **Usar DTOs** para validación de entrada
5. **Documentar cambios** importantes

Este resumen proporciona toda la información necesaria para que otro LLM pueda continuar el desarrollo del proyecto Lichytex. 