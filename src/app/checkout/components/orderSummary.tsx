import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verifyCoupon } from "@/lib/http/api";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { CouponCodeData } from "@/lib/types";
import { getItemTotal } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { is } from "zod/v4/locales";

const TAXES_PERCENTAGE = 18;
const DELIVERY_CHARGES = 5;

const OrderSummary = ({
  handleCouponCodeChange,
  isPlaceOrderPending,
}: {
  handleCouponCodeChange: (code: string) => void;
  isPlaceOrderPending: boolean;
}) => {
  const searchParams = useSearchParams();
  const couponCodeRef = useRef<HTMLInputElement>(null);

  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const cart = useAppSelector((state) => state.cart.cartItems);

  const subTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr.qty * getItemTotal(curr);
    }, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercentage) / 100);
  }, [subTotal, discountPercentage]);

  const taxesAmount = useMemo(() => {
    const amountAfterDiscount = subTotal - discountAmount;

    return Math.round((amountAfterDiscount * TAXES_PERCENTAGE) / 100);
  }, [discountAmount, subTotal]);

  const grandWithDiscountTotal = React.useMemo(() => {
    return subTotal - discountAmount + taxesAmount + DELIVERY_CHARGES;
  }, [subTotal, discountAmount, taxesAmount]);

  const grandWithoutDiscountTotal = React.useMemo(() => {
    return subTotal + taxesAmount + DELIVERY_CHARGES;
  }, [subTotal, taxesAmount]);

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationKey: ["couponCode"],
    mutationFn: async () => {
      if (!couponCodeRef.current) return;

      const restaurantId = searchParams.get("restaurantId");
      if (!restaurantId) return;

      const data: CouponCodeData = {
        code: couponCodeRef.current?.value,
        tenantId: restaurantId,
      };
      return await verifyCoupon(data).then((res) => res.data);
    },
    onSuccess: (data) => {
      const couponData = data as { valid: boolean; discount: number };
      if (couponData.valid) {
        setDiscountError("");
        handleCouponCodeChange(couponCodeRef.current?.value || "");
        setDiscountPercentage(couponData.discount);
        return;
      }

      setDiscountError("Coupon is invalid");
      handleCouponCodeChange("");
      setDiscountPercentage(0);
    },
    onError: (err: any) => {
      const serverMsg = err?.response?.data?.errors?.[0]?.msg;
      if (serverMsg) {
        setDiscountError(serverMsg);
      } else {
        setDiscountError("Something went wrong. Please try again.");
      }
      setDiscountPercentage(0);
    },
  });
  console.log(error);
  const handleCouponValidation = (e: React.MouseEvent) => {
    e.preventDefault();

    mutate();
  };

  return (
    <Card className="w-2/5 border-none h-auto self-start">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold">&#36;{subTotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes</span>
          <span className="font-bold">&#36;{taxesAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery charges</span>
          <span className="font-bold">&#36;{DELIVERY_CHARGES}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span className="font-bold">&#36;{discountAmount}</span>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <span className="font-bold">Order total</span>
          <span className="font-bold flex flex-col items-end">
            <span
              className={discountPercentage ? "line-through text-gray-400" : ""}
            >
              ₹{grandWithoutDiscountTotal}
            </span>
            {discountPercentage ? (
              <span className="text-green-700">${grandWithDiscountTotal}</span>
            ) : null}
          </span>
        </div>

        {discountError && <div className="text-red-500">{discountError}</div>}
        {/* {isError && <div className="text-red-500">{error.message}</div>} */}

        <div className="flex items-center gap-4">
          <Input
            id="coupon"
            name="code"
            type="text"
            className="w-full"
            placeholder="Coupon code"
            ref={couponCodeRef}
          />
          <Button
            onClick={handleCouponValidation}
            variant="outline"
            disabled={isPending || isSuccess}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                <span>Applying...</span>
              </span>
            ) : isSuccess ? (
              "Applied ✅"
            ) : (
              "Apply"
            )}
          </Button>
        </div>
        <div className="text-right mt-6">
          <Button disabled={isPlaceOrderPending}>
            {isPlaceOrderPending ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                <span className="ml-2">Placing order...</span>
              </span>
            ) : (
              <span>Place order</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
