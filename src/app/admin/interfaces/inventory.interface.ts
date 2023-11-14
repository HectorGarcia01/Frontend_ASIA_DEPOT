export interface getInventory {
    id: number;
    Tipo_Movimiento: string;
    Cantidad_Movimiento: string;
    Monto_Movimiento: string;
    empleado: {
        id: number;
        Nombre_Empleado: string;
        Apellido_Empleado: string;
    };
    createdAt: string;
}

export interface getInventoryDetail {
    id: number;
    Tipo_Movimiento: string;
    Cantidad_Movimiento: string;
    Monto_Movimiento: string;
    empleado: {
        id: number;
        Nombre_Empleado: string;
        Apellido_Empleado: string;
    };
    producto: {
        id: number;
        Nombre_Producto: string;
        Precio_Venta: number;
        Precio_Compra?: number;
    };
    createdAt: string;
}