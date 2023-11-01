export interface addCustomer {
    [key: string]: any;
    Nombre_Cliente: string;
    Apellido_Cliente: string;
    Telefono_Cliente: string;
    NIT_Cliente?: number;
    Direccion_General?: string;
    Correo_Cliente: string;
    Password_Cliente: string;
    Repetir_Password_Cliente: string;
    ID_Departamento_FK?: number;
    ID_Municipio_FK?: number;
}

export interface getCustomer {
    id: number;
    Nombre_Cliente: string;
    Apellido_Cliente: string;
    Telefono_Cliente: string;
    NIT_Cliente?: string;
    Direccion_General?: string;
    Correo_Cliente: string;
    municipio?: {
        id?: number;
        Nombre_Municipio?: string;
        departamento?: {
            id?: number;
            Nombre_Departamento?: string;
        }
    };    
    estado: {
        id: number;
        Tipo_Estado: string;
    };
}

export interface updateCustomer {
    nombre: string;
    apellido: string;
    telefono: string;
    nit: string;
    direccionGeneral: string;
    departamento: number;
    municipio: number;
}