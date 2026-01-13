"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { api } from "@/api/axios";
import { IUserTransaction } from "@/types";
import { useAuth } from "@/context/AuthContext";

const isSpotTransaction = (tx: IUserTransaction) =>
  tx.action.action_type === "BUY" || tx.action.action_type === "SELL";

const isDepWithTransaction = (tx: IUserTransaction, userEmail?: string) => {
  // Only include transactions that involve the current user
  return (
    (tx.receiver_id?.email === userEmail || tx.sender_id?.email === userEmail) &&
    (tx.action.action_type === "DEPOSIT" || tx.action.action_type === "WITHDRAW")
  );
};

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleString();

const TransactionCard = ({
  tx,
  userEmail,
}: {
  tx: IUserTransaction;
  userEmail?: string;
}) => {
  const fiat = tx.transaction_type.fiat;
  const token = tx.transaction_type.token;

  // Determine if it's a deposit or withdraw for the current user
  let typeLabel = tx.action.action_type;
  if (tx.sender_id?.email === userEmail) typeLabel = "WITHDRAW";
  if (tx.receiver_id?.email === userEmail) typeLabel = "DEPOSIT";

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
      <div className="flex justify-between">
        <span className="font-semibold">{typeLabel}</span>
        <span className="text-xs text-neutral-400">
          {fiat?.fiat_type || token?.token_type}
        </span>
      </div>

      <p className="text-sm mt-1">
        Amount: {fiat?.fiat_amount ?? token?.token_amount}
      </p>

      <p
        className={`text-xs mt-1 ${
          tx.status === "COMPLETED"
            ? "text-green-400"
            : tx.status === "FAILED"
            ? "text-red-400"
            : "text-yellow-400"
        }`}
      >
        Status: {tx.status}
      </p>

      <p className="text-xs text-neutral-500 mt-1">{formatDate(tx.updatedAt)}</p>
    </div>
  );
};

const MenuItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex cursor-pointer items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
  >
    <span className="text-sm">{label}</span>
    <span className="text-neutral-500">›</span>
  </div>
);

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
    <div className="max-w-md mx-auto px-2 pt-4">
      <div className="flex justify-end mb-4">
        <X
          className="w-6 h-6 cursor-pointer text-neutral-300"
          onClick={onClose}
        />
      </div>
      {children}
    </div>
  </div>
);

const Transactions = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<IUserTransaction[]>([]);
  const [view, setView] = useState<"ALL" | "SPOT" | "DEPWITH" | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await api.get<IUserTransaction[]>("/users/assets/transactions");
      setTransactions(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    }
  }

  const filteredTransactions = useMemo(() => {
    if (!user?.email) return [];

    if (view === "SPOT") {
      return transactions.filter(isSpotTransaction);
    }
    if (view === "DEPWITH") {
      return transactions.filter((tx) => isDepWithTransaction(tx, user.email));
    }
    return transactions;
  }, [transactions, view, user?.email]);

  return (
    <div className="text-white px-4 pb-20 max-w-xl mx-auto">
      <ArrowLeft
        className="w-6 h-6 cursor-pointer text-neutral-300"
        onClick={() => router.back()}
      />

      <h2 className="font-extrabold text-2xl mt-5">Transactions</h2>

      {/* MENU */}
      <div className="space-y-2 mt-5">
        <MenuItem label="All" onClick={() => setView("ALL")} />
        <MenuItem label="Spot Orders" onClick={() => setView("SPOT")} />
        <MenuItem
          label="Deposit / Withdrawals"
          onClick={() => setView("DEPWITH")}
        />
      </div>

      {/* MODAL */}
      {view && (
        <Modal onClose={() => setView(null)}>
          <h3 className="font-bold mb-3">
            {view === "ALL"
              ? "All Transactions"
              : view === "SPOT"
              ? "Trading Orders"
              : "Deposit / Withdrawals"}
          </h3>

          {filteredTransactions.length === 0 && (
            <p className="text-neutral-500 text-sm text-center mt-10">
              No transactions found
            </p>
          )}

          {filteredTransactions.map((tx) => (
            <TransactionCard key={tx._id} tx={tx} userEmail={user?.email} />
          ))}
        </Modal>
      )}
    </div>
  );
};

export default Transactions;
