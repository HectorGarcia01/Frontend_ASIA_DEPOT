export interface addCategory {
    [key: string]: any;
    Nombre_Categoria: string;
    Descripcion_Categoria?: string;
}

export interface getCategory {
    id: number;
    Nombre_Categoria: string;
    Descripcion_Categoria?: string;
}

export interface updateCategory {
    [key: string]: any;
    Nombre_Categoria?: string;
    Descripcion_Categoria?: string;
}