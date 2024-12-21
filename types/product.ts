export type Product = {
  shopName: string;
  userCode: string;
  ean: string;
  price: number;
  note: string;
  inPromo: boolean;
  date: Date;
  photos: Array<string>;
};

export type Products = {
  products: Product[];
};
