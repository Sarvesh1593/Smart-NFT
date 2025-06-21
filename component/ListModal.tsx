import { useState } from "react";
import { useChainId, useWriteContract } from "wagmi";
import { abi, contractAddress } from "../constant";
import { parseEther } from "viem";

interface probs {
  tokenId: number;
  onClose: () => void;
}
export default function ListModal({ tokenId, onClose }: probs) {
  const [price, setprice] = useState("");
  const chainId = useChainId();
  const contractAddr = (contractAddress as any)[chainId.toString()]?.[0];

  const { data: hash, writeContract } = useWriteContract();

  const handleList = async () => {
    try {
      writeContract({
        address: contractAddr,
        abi,
        functionName: "listItem",
        args: [BigInt(tokenId), parseEther(price)],
      });
      onClose(); // Move this to onSuccess ideally
    } catch (error) {
      console.error("Listing failed", error);
      alert("Listing failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white"> List NFT</h2>

        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setprice(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleList}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}
