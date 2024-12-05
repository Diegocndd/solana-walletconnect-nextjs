interface Window {
  phantom?: {
    solana: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
    };
  };
}
