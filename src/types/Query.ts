export interface ICommonQuery {
  searchKey?: string;
  page?: number;
  size?: number;
  all?: 1;
}

export interface ICategoryQuery extends ICommonQuery {
  parentId?: string;
}

export interface IProductQuery extends ICommonQuery {
  categoryId?: string;
}

export interface IAtributeOption extends ICommonQuery {
  atributeId?: string;
}

export interface IVariantQuery extends ICommonQuery {
  productId?: string;
}
