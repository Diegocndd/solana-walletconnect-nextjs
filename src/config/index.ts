import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { createAppKit } from "@reown/appkit/react";

const solanaWeb3JsAdapter = new SolanaAdapter({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const config = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solanaDevnet, solanaTestnet, solana],
  metadata: metadata,
  projectId,
});
