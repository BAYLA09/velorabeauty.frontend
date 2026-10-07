"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { BundleQuantity } from "@/config/pricing";

export type CheckoutCardDeliveryForm = {
  email: string;
  name: string;
  phone: string;
  emirate: string;
  address: string;
  building: string;
};

type CheckoutCardFormContextValue = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  form: CheckoutCardDeliveryForm;
  setEmail: (v: string) => void;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setEmirate: (v: string) => void;
  setAddress: (v: string) => void;
  setBuilding: (v: string) => void;
};

const CheckoutCardFormContext = createContext<CheckoutCardFormContextValue | null>(null);

export function useCheckoutCardForm() {
  const ctx = useContext(CheckoutCardFormContext);
  if (!ctx) {
    throw new Error("useCheckoutCardForm must be used within CheckoutCardFormProvider");
  }
  return ctx;
}

type ProviderProps = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  children: ReactNode;
};

export function CheckoutCardFormProvider({
  productSlug,
  productName,
  quantity,
  children,
}: ProviderProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");

  const value = useMemo<CheckoutCardFormContextValue>(
    () => ({
      productSlug,
      productName,
      quantity,
      form: { email, name, phone, emirate, address, building },
      setEmail,
      setName,
      setPhone,
      setEmirate,
      setAddress,
      setBuilding,
    }),
    [productSlug, productName, quantity, email, name, phone, emirate, address, building],
  );

  return (
    <CheckoutCardFormContext.Provider value={value}>{children}</CheckoutCardFormContext.Provider>
  );
}
