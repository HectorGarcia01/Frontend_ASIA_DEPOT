export interface addCategory {
    [key: string]: any;
    Nombre_Categoria: string;
    Descripcion_Categoria?: string;
}

export interface getCategory {
    id: number;
    Nombre_Categoria: string;
    Descripcion_Categoria?: string;
    createdAt: string;
    estado: {
        id: number;
        Tipo_Estado: string;
    };
}

export interface updateCategory {
    [key: string]: any;
    Nombre_Categoria?: string;
    Descripcion_Categoria?: string;
}