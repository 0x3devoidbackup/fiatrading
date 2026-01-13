import React, { useState } from "react";
import {
  Send,
  Rocket,
  X,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Plus,
  Minus,
  ArrowBigRight,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { api } from "@/api/axios";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import CenterLoader from "@/utils/loader";
import { notify } from "@/utils/notify";

interface PaymentOpt {
  type: "paypal";
}

const PaymentOptions = () => {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDeposit(opt: PaymentOpt) {
    try {
      if (opt.type === "paypal") {
        setLoading(true);
        await createPaypalOrder();
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      console.log(error)

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
    } finally {
      setLoading(false);
    }
  }

  async function createPaypalOrder() {
    for (let i = 0; i < 3; i++) {
      try {
        const data = { amount: 300, currency: "USD" };
        return await api.post("/auth/paypal/order/create", data);
      } catch (err: any) {
        if (i === 2) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  return (
    <>
      <CenterLoader show={loading} />
      <div className="bg-[#1b1d22] p-2 mt-5 rounded-xl">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => handleDeposit({ type: "paypal" })}
        >
          <div className="flex space-x-3 ">
            <div className="w-10 h-10 flex items-center justify-center ">
              <Image
                src="/images/paypal.png"
                alt="PayPal"
                width={40}
                height={40}
                className="object-contain rounded"
              />
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold">PayPal</h3>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </>
  );
};

export default PaymentOptions;
