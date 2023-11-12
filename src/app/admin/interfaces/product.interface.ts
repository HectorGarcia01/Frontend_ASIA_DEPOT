
export interface addProduct {
    [key: string]: any;
    Nombre_Producto: string;
    Precio_Venta: number;
    Precio_Compra: number;
    Descripcion_Producto: string;
    Cantidad_Stock: number;
    Producto_Destacado: boolean;
    ID_Categoria_FK: number;
    ID_Marca_FK: number;
}

export interface getProduct {
    id: number;
    Nombre_Producto: string;
    Precio_Venta: number;
    Precio_Compra: number;
    Descripcion_Producto: string;
    Cantidad_Stock: number;
    Producto_Destacado: boolean;
    createdAt: string;
    estado: {
        id: number;
        Tipo_Estado: string;
    };
    categoria: {
        id: number;
        Nombre_Categoria: string;
    };
    marca: {
        id?: number;
        Nombre_Marca?: string;
    }
}

export interface updateProduct {
    [key: string]: any;
    
}