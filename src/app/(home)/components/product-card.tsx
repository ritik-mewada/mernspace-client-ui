import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import Image from "next/image";

import { Product } from "@/lib/types";
import ProductModel from "./product-model";
import { Suspense } from "react";
import { getFromPrice } from "@/lib/utils";

type PropTypes = { product: Product };

const ProductCard = ({ product }: PropTypes) => {
  return (
    <Card className="border-none rounded-xl">
      <CardHeader className="flex items-center justify-center">
        <Image src={product.image} width={150} height={150} alt="pizza-image" />
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="mt-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-2">
        <p>
          <span>From</span>{" "}
          <span className="font-bold">${getFromPrice(product)}</span>
        </p>

        <Suspense fallback={"Loading..."}>
          <ProductModel product={product} />
        </Suspense>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
