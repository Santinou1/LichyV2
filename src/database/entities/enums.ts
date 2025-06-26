// Enums compartidos entre entidades

export enum ProductUnit {
  KG = 'kg',
  M = 'm',
  UNI = 'uni',
}

export enum ProductAlternativeUnit {
  CAJAS = 'cajas',
  ROLLOS = 'rollos',
}

export enum ProductStatus {
  EN_STOCK = 'en_stock',
  PEDIDO = 'pedido',
  ENTREGADO = 'entregado',
  RESERVADO = 'reservado',
}

export enum UserRole {
  ADMIN = 'admin',
  LOGISTICA = 'logistica',
  DEPOSITO = 'deposito',
  VENTAS = 'ventas',
}

export enum ContainerCategory {
  CREADO = 'CREADO',
  COMPRADO = 'COMPRADO',
  EMBARCADO = 'EMBARCADO',
  ARRIBADO = 'ARRIBADO',
  DEPOSITO_NACIONAL = 'DEPOSITO_NACIONAL',
  EN_STOCK = 'EN_STOCK',
  ENTREGADO = 'ENTREGADO',
  ANULADO = 'ANULADO',
}

export enum ContainerLocation {
  // CREADO
  NUEVO = 'NUEVO',
  
  // COMPRADO
  FALTA_DISPONER = 'FALTA_DISPONER',
  DESARROLLO_LD_SOFF = 'DESARROLLO_LD_SOFF',
  LD_SOFF_LLEGARON = 'LD_SOFF_LLEGARON',
  PRODUCCION = 'PRODUCCION',
  
  // EMBARCADO
  BOOKING = 'BOOKING',
  EMBARCADO = 'EMBARCADO',
  
  // ARRIBADO
  TERMINAL = 'TERMINAL',
  DF_DASSA = 'DF_DASSA',
  DF_LOGISTICA_CENTRAL = 'DF_LOGISTICA_CENTRAL',
  PARA_OFICIALIZAR = 'PARA_OFICIALIZAR',
  PARA_OFICIALIZAR_HOY = 'PARA_OFICIALIZAR_HOY',
  POR_COORDINAR = 'POR_COORDINAR',
  COORDINADO = 'COORDINADO',
  
  // DEPOSITO_NACIONAL
  ALTITUD = 'ALTITUD',
  MOREIRO = 'MOREIRO',
  OPEN_CARGO = 'OPEN_CARGO',
  LOGISTICA_CENTRAL = 'LOGISTICA_CENTRAL',
  ULOG = 'ULOG',
  ALA = 'ALA',
  
  // EN_STOCK
  MITRE = 'MITRE',
  LAVALLE = 'LAVALLE',
  LICHY = 'LICHY',
  
  // ENTREGADO
  ENTREGADO = 'ENTREGADO',
  
  // ANULADO
  ANULADO = 'ANULADO',
}

export enum ContainerMovementType {
  CAMBIO_CATEGORIA = 'cambio_categoria',
  CAMBIO_UBICACION = 'cambio_ubicacion',
  CAMBIO_AMBOS = 'cambio_ambos',
  CREACION = 'creacion',
  ANULACION = 'anulacion',
}

export enum OrderStatus {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  EN_PREPARACION = 'en_preparacion',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

export enum OrderDestination {
  MITRE = 'MITRE',
  LICHY = 'LICHY',
}

export enum MovementType {
  INGRESO = 'ingreso',
  EGRESO = 'egreso',
  TRANSFERENCIA = 'transferencia',
  AJUSTE = 'ajuste',
  RESERVA = 'reserva',
  LIBERACION = 'liberacion',
}

export enum MovementReason {
  COMPRA = 'compra',
  VENTA = 'venta',
  TRANSFERENCIA_DEPOSITO = 'transferencia_deposito',
  AJUSTE_INVENTARIO = 'ajuste_inventario',
  RESERVA_PEDIDO = 'reserva_pedido',
  LIBERACION_PEDIDO = 'liberacion_pedido',
  DISTRIBUCION_COLORES = 'distribucion_colores',
  MERMA = 'merma',
  DEVOLUCION = 'devolucion',
} 