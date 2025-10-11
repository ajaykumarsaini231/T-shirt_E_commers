"use client";
import { ProductInCart, useProductStore } from "@/app/_zustand/store";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

const QuantityInputCart = ({ product }: { product: ProductInCart }) => {
  const [quantityCount, setQuantityCount] = useState<number>(product.amount);
  const { updateCartAmount } = useProductStore();

  const handleQuantityChange = (actionName: string): void => {
    if (actionName === "plus") {
      const newCount = quantityCount + 1;
      setQuantityCount(newCount);
      updateCartAmount(product.id, newCount);
    } else if (actionName === "minus" && quantityCount > 1) {
      const newCount = quantityCount - 1;
      setQuantityCount(newCount);
      updateCartAmount(product.id, newCount);
    }
  };

  return (
    <div>
      <label htmlFor="Quantity" className="sr-only">
        Quantity
      </label>

      <div className="flex items-center justify-center rounded border border-gray-200 w-32">
        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex items-center justify-center"
          onClick={() => handleQuantityChange("minus")}
        >
          <FaMinus />
        </button>

        <input
          type="number"
          id="Quantity"
          disabled
          value={quantityCount}
          className="h-10 w-16 border-transparent text-center sm:text-sm [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex items-center justify-center"
          onClick={() => handleQuantityChange("plus")}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default QuantityInputCart;
