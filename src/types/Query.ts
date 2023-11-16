export interface ICommonQuery {
  searchKey?: string;
  page?: number;
  size?: number;
  all?: 1;
}

export interface ICategoryQuery extends ICommonQuery {
  parentId?: string;
}
