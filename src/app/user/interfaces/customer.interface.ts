export interface addCustomer {
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
    nombre: string;
    apellido: string;
    telefono: string;
    nit: string;
    direccionGeneral: string;
    correo: string;
    departamento: number; //Tipo de dato pendiente
    municipio: number;    //Tipo de dato pendiente
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