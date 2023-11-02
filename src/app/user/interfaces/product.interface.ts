export interface Product {
    id: number;
    Nombre_Producto: string;
    Precio_Venta: number;
    Descripcion_Producto?: string;
    Cantidad_Stock: number;
    Producto_Destacado: boolean;
    estado: {
        id: number;
        Tipo_Estado: string
    };
    categoria: {
        id: number;
        Nombre_Categoria: string;
    };
    marca?: {
        id?: number;
        Nombre_Marca?: string;
    };
}

export interface FavoriteProduct {
    id: number;
    producto: {
        id: number;
        Nombre_Producto: string;
        Descripcion_Producto: string;
        Cantidad_Stock: number;
        Precio_Venta: number;
        estado: {
            id: number;
            Tipo_Estado: string;
        };
    }
}

export interface Products {
    productos: Product[];
}