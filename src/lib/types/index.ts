export interface Tenant {
  id: string;
  name: string;
  address: string;
}

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}
export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export interface ProductAttribute {
  name: string;
  value: string | boolean;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  isPublish: boolean;
  createAt: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  image: string;
}
