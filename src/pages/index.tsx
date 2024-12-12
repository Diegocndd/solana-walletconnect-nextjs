/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";

function truncateStringMiddle(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;

  const halfLength = Math.floor((maxLength - 3) / 2);
  const start = input.slice(0, halfLength);
  const end = input.slice(-halfLength);

  return `${start}...${end}`;
}

const chains_id: any = {
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1: "Devnet",
  "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z": "Tesnet",
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": "Mainnet",
};

export default function Home() {
  const { open } = useAppKit();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { address, isConnected } = useAppKitAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const isConnecting = false;

  const getBalance = async () => {
    if (!connection || !walletProvider.publicKey) return;

    const b = await connection.getBalance(walletProvider.publicKey);

    if (b < LAMPORTS_PER_SOL / 100) {
      setBalance(0);
      return;
    }

    setBalance(b);
  };

  const transferSOL = async () => {
    if (loading) return;

    if (Number(amount) <= 0) {
      toast.error("Amount must be greater then 0");
      return;
    }

    if (!receiverAddress) {
      toast.error("Please, provide a receiver address");
      return;
    }

    if (!connection || !walletProvider) {
      return;
    }

    if (!walletProvider.publicKey) return;

    try {
      setLoading(true);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletProvider.publicKey,
          toPubkey: new PublicKey(receiverAddress),
          lamports: Number(amount) * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = walletProvider.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;

      const signedTransaction = await walletProvider.signTransaction(
        transaction
      );
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await connection.confirmTransaction(signature, "confirmed");
      toast.error(`Tx successfully send!`);
      getBalance();
      setLoading(false);
    } catch (error: any) {
      console.log(error, error.message);
      if (
        error.message.includes("Transaction was not confirmed in 30.00 seconds")
      ) {
        toast.success(`Tx successfully send!`);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Could not send tx!", error);
      }
      console.error(error);
    }

    getBalance();
  };

  useEffect(() => {
    if (address) {
      getBalance();
    }
  }, [address, chainId]);

  if (isConnecting) {
    return (
      <div className="p-10 w-full items-center justify-center h-[100vh] flex flex-col">
        <span className="font-bold text-xl">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-10 w-full bg-white items-center justify-center h-[100vh] flex flex-col">
        <button
          className="hover:bg-green-300 border-2 border-green-800 transition-all shadow font-bold bg-green-200 text-green-800 px-8 rounded-lg py-2"
          onClick={() => open()}
        >
          Connect wallet
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="px-12 py-12 flex items-center gap-4">
        <button
          onClick={() => walletProvider?.disconnect()}
          className="bg-red-100 rounded-lg flex items-center gap-2 px-5 py-2 border-2 border-red-800"
        >
          <b>Disconnect Wallet</b>
        </button>
        <div className="bg-orange-100 flex items-center gap-2 px-5 py-2  border-orange-800">
          <b>Provider:</b>{" "}
          <img src={walletProvider?.icon} width={20} height={20} />{" "}
          {walletProvider?.name}
        </div>

        <div className="bg-orange-100 px-5 py-2 border">
          <b>Network:</b>{" "}
          <button
            onClick={() => {
              if (!chainId) return;

              if (chains_id[chainId] === "Devnet") {
                switchNetwork(solanaTestnet);
              } else if (chains_id[chainId] === "Tesnet") {
                switchNetwork(solana);
              } else {
                switchNetwork(solanaDevnet);
              }
            }}
            className="bg-yellow-100 border-yellow-800 border-2 rounded px-5 py-0"
          >
            {chainId && chains_id[chainId]}
          </button>
        </div>
      </div>
      <div className="p-10 w-full h-[100vh] flex items-start gap-5 justify-center bg-white">
        <div className="w-[15rem] shadow h-[10rem] bg-blue-100 justify-around rounded-xl flex flex-col items-center py-4">
          <span className="text-[#323232] text-lg font-bold">Wallet</span>
          <button
            onClick={() => {
              open();
            }}
            className="bg-green-100 border-green-700 border-2 px-3 rounded-lg py-2 flex items-center gap-2"
          >
            Open wallet
          </button>
        </div>

        <div className="w-[15rem] shadow h-[10rem] bg-blue-100 justify-around rounded-xl flex flex-col items-center py-4">
          <span className="text-[#323232] text-lg font-bold">Address</span>
          <button
            onClick={() => {
              if (!address) return;

              navigator.clipboard
                .writeText(address)
                .then(() => toast.success("Address copied!"));
            }}
            className="bg-green-100 border-green-700 border-2 px-3 rounded-lg py-2 flex items-center gap-2"
          >
            {address && truncateStringMiddle(address, 17)}
            <IoCopy />
          </button>
        </div>

        <div className="w-[15rem] shadow h-[10rem] bg-blue-100 justify-around rounded-xl flex flex-col items-center py-4">
          <span className="text-[#323232] text-lg font-bold">Balance</span>
          <div className="bg-green-100 border-green-700 border-2 px-3 rounded-lg py-2 flex items-center gap-2">
            {balance / 10 ** 9} SOL
          </div>
        </div>

        <div className="w-[20rem] shadow h-[20rem] bg-blue-100 justify-around rounded-xl flex flex-col items-center py-4">
          <span className="text-[#323232] text-lg font-bold">Send Tx</span>
          <input
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            value={amount}
            placeholder="Amount (SOL)"
            type="text"
            className="bg-white border-slate-400 rounded border py-1 px-3"
          />

          <input
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Receiver address"
            className="bg-white border-slate-400 rounded border py-1 px-3 -mt-10"
          />
          <button
            onClick={() => {
              transferSOL();
            }}
            className="bg-green-100 w-54 border-green-700 border-2 px-3 rounded-lg py-2 flex items-center gap-2"
          >
            {loading ? "Sending..." : "Create Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
