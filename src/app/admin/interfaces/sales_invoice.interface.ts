export interface getSaleInvoice {
    id: number;
    Numero_Orden: string;
    Total_Factura: number;
    empleado?: {
        id: number;
        Nombre_Empleado: string;
        Apellido_Empleado: string;
    };
    createdAt: string;
    estado: {
        id: number;
        Tipo_Estado: string;
    };
}

export interface getSaleDetail {
    id: number;
    Numero_Orden: string;
    Total_Factura: number;
    detalles_venta: [{
        id: number;
        Cantidad_Producto: number;
        Precio_Unitario: number;
        Subtotal_Venta: number;
        producto: {
            id: number;
            Nombre_Producto: string;
        }
    }];
    cliente: {
        Nombre_Cliente: string;
        Apellido_Cliente: string;
    };
    createdAt: string;
    estado: {
        id: number;
        Tipo_Estado: string;
    };
}