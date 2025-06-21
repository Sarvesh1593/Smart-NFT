import Image from "next/image";
import { useState } from "react";
import ListModal from "./ListModal";

interface NFTBoxProps {
  imageURI: string;
  tokenName: string;
  tokenDescription: string;
  tokenId: number;
  ownerAddress?: string;
  currentAccount?: string;
  tokenPrice?: string;
  onBuy?: () => void;
  allowListing?: boolean;
}
export default function NFTBox({
  imageURI,
  tokenName,
  tokenDescription,
  tokenId,
  ownerAddress,
  currentAccount,
  tokenPrice,
  onBuy,
  allowListing,
}: NFTBoxProps) {
  const [showModal, setShowModal] = useState(false);
  const isOwner =
    currentAccount?.toLowerCase() === ownerAddress?.toLocaleLowerCase();
  const handleClick = () => {
    if (isOwner && allowListing) {
      setShowModal(true);
    }
  };
  return (
    <>
      <div
        className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition w-full max-w-[320px] mx-auto"
        onClick={handleClick}
      >
        <Image
          src={imageURI}
          alt={tokenName}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
        <h3 className="text-xl text-black font-bold mt-2">{tokenName}</h3>
        <p className="text-sm text-gray-600">{tokenDescription}</p>
        <p className="text-xs text-gray-500 mt-1">Token #{tokenId}</p>

        {tokenPrice && (
          <p className="text-sm text-green-600 font-semibold mt-1">
            {tokenPrice} ETH
          </p>
        )}
        {onBuy && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={onBuy}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Buy
            </button>
          </div>
        )}
      </div>
      {/*Show modal only for the owner */}
      {showModal && (
        <ListModal tokenId={tokenId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
