export interface ShoppingHistory {
    id: number;
    Numero_Orden: string;
    Total_Factura: number;
    createdAt: Date;
    cliente: {
        Nombre_Cliente: string;
        Apellido_Cliente: string;
    }
    estado: {
        id: number;
        Tipo_Estado: string;
    }
}

export interface ShoppingDetail {
    id: number;
    Cantidad_Producto: number;
    Precio_Unitario: number;
    Subtotal_Venta: number;
    producto: {
        id: number;
        Nombre_Producto: string;
        Descripcion_Producto: string;
    }
}