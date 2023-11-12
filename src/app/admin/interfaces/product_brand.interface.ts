export interface addProductBrand {
    [key: string]: any;
    Nombre_Marca: string;
}

export interface getProductBrand {
    id: number;
    Nombre_Marca: string;
}

export interface updateProductBrand {
    [key: string]: any;
    Nombre_Marca?: string;
}