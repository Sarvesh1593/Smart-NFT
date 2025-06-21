import { useState } from "react";
import { abi, contractAddress } from "../constant";
import { useChainId } from "wagmi";
import { BrowserProvider, Contract } from "ethers";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function MintModal({ isOpen, onClose }: MintModalProps) {
  const [address, setAddress] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const chainId = useChainId(); // Already a number
  const contractaddress = (contractAddress as any)[chainId.toString()]?.[0];

  const handleMint = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(contractaddress, abi, signer);

      const tx = await contract.mintNFT(address, tokenUri);

      await tx.wait();
      alert("Mint successful!");
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      alert("Mint failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-light-blue p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Mint NFT</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Recipient Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Token URI"
          value={tokenUri}
          onChange={(e) => setTokenUri(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleMint}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
}
