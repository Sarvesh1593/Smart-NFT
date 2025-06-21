"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainId, useWriteContract } from "wagmi";
import { abi, contractAddress } from "@/constant";

export default function Header() {
  const chainId = useChainId();

  const { writeContract } = useWriteContract();
  const contractAddr = (contractAddress as any)[chainId.toString()]?.[0];

  const handleWithdraw = async () => {
    try {
      const tx = await writeContract({
        address: contractAddr,
        abi,
        functionName: "withdrawProceeds",
        args: [],
      });

      console.log("Transaction sent:", tx);
      // Optionally show toast or success message here
    } catch (err) {
      console.error("Withdraw failed:", err);
      // Optionally show error message to the user
    }
  };
  return (
    <nav className="w-full p-5 flex justify-between items-center fixed shadow-md z-50 bg-black">
      <h1 className="text-3xl font-bold">Smart NFT</h1>
      <div className="flex items-center space-x-6">
        {/* <button
          onClick={async () => {
            handleWithdraw;
          }}
          className="text-white"
        >
          Withodraw Balance
        </button> */}
        <span>About</span>
        <a href="#collection" className="cursor-pointer">
          Collection
        </a>
        <span>FAQs</span>
        <div className="scale-90">
          <ConnectButton accountStatus="avatar" />
        </div>
      </div>
    </nav>
  );
}
