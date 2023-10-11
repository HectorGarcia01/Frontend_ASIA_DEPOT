import { Category } from "./category.interface";
import { ProductBrand } from "./product_brand.interface";

export interface Product {
    id: number;
    Nombre_Producto: string;
    Descripcion_Categoria?: string;
    Precio_Venta: number;
    Descripcion_Producto?: string;
    Cantidad_Stock: number;
    categoria: Category[];
    marca: ProductBrand[];
}

export interface Products {
    productos: Product[];
}