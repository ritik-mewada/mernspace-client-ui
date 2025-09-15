import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const ORDER_SERVICE_PREFIX = "/api/order";

export const getCustomer = async () =>
  api.get(`${ORDER_SERVICE_PREFIX}/customer`);

export const addAddress = async (customerId: string, address: string) =>
  api.patch(`${ORDER_SERVICE_PREFIX}/customer/addresses/${customerId}`, {
    address,
  });
