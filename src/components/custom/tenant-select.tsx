"use client";
import { Tenant } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

const TenantSelect = ({ restaurants }: { restaurants: { data: Tenant[] } }) => {
  const router = useRouter();
  const handleValueChange = (value: string) => {
    router.push(`/?restaurantId=${value}`);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] focus:ring-0 ">
        <SelectValue placeholder="Select Restaurant" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {restaurants.data.map((restaurant: Tenant) => {
            return (
              <SelectItem key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TenantSelect;
