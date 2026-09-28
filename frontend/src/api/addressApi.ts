import { apiClient } from "./client";
import type { Address, AddressRequest } from "../types/address";

const getAddresses = async () => {
  const response = await apiClient.get<Address[]>("/api/addresses");

  return response.data;
};

const createAddress = async (request: AddressRequest) => {
  const response = await apiClient.post<Address>(
    "/api/addresses",
    request
  );

  return response.data;
};

const updateAddress = async (
  addressId: number,
  request: AddressRequest
) => {
  const response = await apiClient.put<Address>(
    `/api/addresses/${addressId}`,
    request
  );

  return response.data;
};

const deleteAddress = async (addressId: number) => {
  await apiClient.delete(`/api/addresses/${addressId}`);
};

export {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};