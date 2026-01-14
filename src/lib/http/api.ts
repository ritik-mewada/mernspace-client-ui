import axios from "axios";
import { CouponCodeData } from "../types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getCustomer = async () =>
  api.get(`http://localhost:5504/customer`);

export const addAddress = async (customerId: string, address: string) =>
  api.patch(`http://localhost:5504/customer/addresses/${customerId}`, {
    address,
  });

export const verifyCoupon = (data: CouponCodeData) =>
  api.post(`http://localhost:5504/coupons/verify`, data);
