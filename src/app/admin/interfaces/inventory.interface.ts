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