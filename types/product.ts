export type Product = {
  shopName: string;
  location: string;
  userCode: string;
  ean: string;
  price: number;
  note: string;
  inPromo: boolean;
  date: string;
  photos: Array<string>;
};

export type Products = {
  products: Product[];
};
