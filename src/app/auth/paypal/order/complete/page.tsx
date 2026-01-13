"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/api/axios";
import CenterLoader from "@/utils/loader";
import { notify } from "@/utils/notify";
import { SuccessIcon, FailedIcon } from "@/utils/Icons";

const PaypalComplete = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  const token = searchParams.get("token");
  const payerID = searchParams.get("PayerID");

  useEffect(() => {
    if (!token || !payerID) {
      notify("Invalid PayPal response");
      setSuccess(false);
      setLoading(false);
      return;
    }

    capturePaypalOrder();
  }, [token, payerID]);

  async function capturePaypalOrder() {
    try {
      setLoading(true);

      const response = await api.post("/auth/paypal/order/complete", {
        token,
        payerID,
      });

      if (response?.status === 200) {
        setSuccess(true);
        notify("Deposit successful!");
      } else {
        setSuccess(false);
        notify("Deposit failed. Please try again.");
      }
    } catch (error: any) {
      setSuccess(false);
      let message = "Something went wrong.";
      if (error.response?.data?.message) message = error.response.data.message;
      notify(message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <CenterLoader show={true} />;

  return (
    <div className="max-w-md mx-auto mt-20 text-center text-white">
      {success ? (
        <>
         <SuccessIcon size={100} />
          <h2 className="text-2xl font-bold mb-4">Deposit Successful</h2>
          <p className="mb-4">Your PayPal deposit has been completed successfully.</p>
          <button
            className="bg-white text-black px-4 text-sm cursor-pointer py-2 rounded-xl font-bold"
            onClick={() => router.push("/portfolio")}
          >
            Go to Dashboard
          </button>
        </>
      ) : (
        <>
         <FailedIcon size={100} />
          <h2 className="text-2xl font-bold mb-4">Deposit Failed </h2>
          <p className="mb-4">Something went wrong with your PayPal deposit.</p>
          <button
            className="bg-white text-black px-4 text-sm cursor-pointer py-2 rounded-xl font-bold"
            onClick={() => router.push("/home")}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default PaypalComplete;
