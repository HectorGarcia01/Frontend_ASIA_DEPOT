export interface Category {
    id: number;
    Nombre_Categoria: string;
    Descripcion_Categoria?: string;
}

export interface Categories {
    categorias: Category[];
}

export interface CategoryResponse {
    categories: Category[];
    totalPages: number;
    currentPage: number;
}