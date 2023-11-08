
export interface addEmployee {
    [key: string]: any;
    Nombre_Empleado: string;
    Apellido_Empleado: string;
    Telefono_Empleado: string;
    NIT_Empleado?: number;
    Correo_Empleado: string;
    Password_Empleado: string;
    Repetir_Password_Empleado: string;
}

export interface getEmployee {
    id: number;
    Nombre_Empleado: string;
    Apellido_Empleado: string;
    Telefono_Empleado: string;
    NIT_Empleado?: string;
    Correo_Empleado: string;
    estado: {
        id: number;
        Tipo_Estado: string;
    };
}

export interface updateCustomer {
    Nombre_Empleado?: string;
    Apellido_Empleado?: string;
    Telefono_Empleado?: string;
    NIT_Empleado?: string;
}