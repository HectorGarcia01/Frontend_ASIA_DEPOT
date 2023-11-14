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