import { Skeleton } from "@/components/ui/skeleton";

const ProductGridSkeleton = () => {
  return (
    <div className="container mx-auto grid grid-cols-4 gap-6 mt-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col space-y-3 rounded-xl border p-4 shadow-sm"
        >
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
