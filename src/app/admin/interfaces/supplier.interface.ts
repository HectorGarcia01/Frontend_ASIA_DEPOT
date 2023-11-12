
export interface addSupplier {
    [key: string]: any;
    Nombre_Proveedor?: string;
    Apellido_Proveedor?: string;
    Nombre_Empresa?: string;
    Telefono_Proveedor: string;
    Correo_Proveedor: string;
}

export interface getSupplier {
    id: number;
    Nombre_Proveedor?: string;
    Apellido_Proveedor?: string;
    Nombre_Empresa?: string;
    Telefono_Proveedor: string;
    Correo_Proveedor: string;
    createdAt: string;
    estado: {
        id: number;
        Tipo_Estado: string;
    };
}

export interface updateSupplier {
    [key: string]: any;
    Nombre_Proveedor?: string;
    Apellido_Proveedor?: string;
    Nombre_Empresa?: string;
    Telefono_Proveedor?: string;
    Correo_Proveedor?: string;
}