import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./product-card";
import { Category, Product } from "@/lib/types";

const ProductList = async () => {
  const [categoryResponse, productsResponse] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/api/catalog/categories`, {
      next: { revalidate: 3600 },
    }),
    fetch(`${process.env.BACKEND_URL}/api/catalog/products?perPage=100`, {
      next: { revalidate: 3600 },
    }),
  ]);

  if (!categoryResponse.ok) {
    throw new Error("Failed to load categories");
  }
  if (!productsResponse.ok) {
    throw new Error("Failed to load products");
  }

  const [categories, products] = await Promise.all([
    categoryResponse.json() as Promise<Category[]>,
    productsResponse.json() as Promise<{ data: Product[] }>,
  ]);
  return (
    <section>
      <div className="container mx-auto py-12">
        <Tabs defaultValue={categories[0]._id}>
          <TabsList>
            {categories.map((category) => {
              return (
                <TabsTrigger
                  key={category._id}
                  className="text-md"
                  value={category._id}
                >
                  {category.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => {
            return (
              <TabsContent value={category._id} key={category._id}>
                <div className="grid grid-cols-4 gap-6 mt-6">
                  {products.data
                    .filter((product) => product.category._id === category._id)
                    .map((product) => (
                      <ProductCard product={product} key={product._id} />
                    ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default ProductList;
