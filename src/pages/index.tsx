import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Connection, PublicKey } from "@solana/web3.js";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function Home() {
  const { open } = useWeb3Modal();
  const [address, setAddress] = useState("");
  const { isConnected, isConnecting } = useAccount();
  const [balance, setBalance] = useState(0);
  const [lastTxs, setLastTxs] = useState<string[]>([]);

  const getWallet = async () => {
    if (window.phantom?.solana?.isPhantom) {
      try {
        const { publicKey } = await window.phantom.solana.connect();
        setAddress(publicKey.toString());
      } catch (error) {
        console.error("Erro ao conectar à Phantom Wallet:", error);
      }
    }
  };

  const getSolanaBalance = async (address: string) => {
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const publicKey = new PublicKey(address);
      const balanceInLamports = await connection.getBalance(publicKey);
      setBalance(balanceInLamports / 1e9);
    } catch (error) {
      console.error("Erro ao obter o saldo:", error);
    }
  };

  async function getLastTransactionHashes(address: string, limit = 4) {
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const publicKey = new PublicKey(address);

      const confirmedSignatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit }
      );

      const transactionHashes = confirmedSignatures.map(
        (signatureInfo) => signatureInfo.signature
      );

      setLastTxs(transactionHashes);
    } catch (error) {
      console.error("Erro ao buscar as transações:", error);
      return [];
    }
  }

  useEffect(() => {
    if (isConnected) {
      getWallet();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected && address) {
      getSolanaBalance(address);
      getLastTransactionHashes(address, 4);
    }
  }, [address, isConnected]);

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
    <div className="p-10 w-full h-[100vh] flex gap-5 flex-col bg-white">
      <div className="text-lg flex gap-2">
        <button
          className="hover:bg-green-300 border-2 border-green-800 transition-all shadow font-bold bg-green-200 text-green-800 px-5 rounded-lg py-1"
          onClick={() => open()}
        >
          Open wallet
        </button>
      </div>

      <table className="w-full text-left text-gray-800 border-collapse rounded-lg shadow-md bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 font-semibold">Property</th>
            <th className="px-4 py-2 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-100 transition">
            <td className="px-4 py-2 font-medium">Address</td>
            <td className="px-4 py-2 flex items-center gap-2">
              {address}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address).then(() => {
                    toast.success("Address copied!");
                  });
                }}
              >
                <IoCopyOutline />
              </button>
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-100 transition">
            <td className="px-4 py-2 font-medium">Balance</td>
            <td className="px-4 py-2">{balance} SOL</td>
          </tr>
          <tr className="hover:bg-gray-100 transition">
            <td className="px-4 py-2 font-medium">Wallet</td>
            <td className="px-4 py-2">Phantom</td>
          </tr>
          <tr className="hover:bg-gray-100 transition">
            <td className="px-4 py-2 font-medium">
              Latest received transactions
            </td>
            <td className="px-4 py-2 flex flex-col gap-2">
              {lastTxs.map((tx, index) => (
                <span key={index}>{tx}</span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
