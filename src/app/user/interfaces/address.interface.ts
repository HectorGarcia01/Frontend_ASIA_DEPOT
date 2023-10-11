export interface Municipalities {
    id: number;
    Nombre_Municipio: string;
    ID_Departamento_FK: number;
}

export interface Department {
    id: number;
    Nombre_Departamento: string;
    municipios: Municipalities[];
}

export interface MunicipalityCustomer {
    id?: number;
    Nombre_Municipio?: string;
    departamento?: DepartmentCustomer[];
}

export interface DepartmentCustomer {
    id?: number;
    Nombre_Departamento?: string;
}