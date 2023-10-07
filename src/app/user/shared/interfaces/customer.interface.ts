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