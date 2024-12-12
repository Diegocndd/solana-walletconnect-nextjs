import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit();

  return (
    <>
      <button
        onClick={() => {
          console.log("ssks");
          open();
        }}
      >
        Open Connect Modal
      </button>
      <button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </button>
    </>
  );
}
