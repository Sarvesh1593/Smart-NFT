import { useState } from "react";
import MintModal from "./MintModel";
export default function Mint() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 ">
      <h1 className="text-3xl md:text-5xl font-semibold text-center">
        The project that inspired the modern{" "}
        <span className="font-bold">CryptoArt movement</span>
      </h1>

      <p className="text-gray-300 mt-6 text-center text-sm md:text-base max-w-xl">
        10,000 unique collectible characters with proof of ownership stored{" "}
        <br />
        on the Ethereum blockchain.
      </p>

      <button
        className="mt-8 bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition "
        onClick={() => setShowModal(true)}
      >
        Mint now
      </button>
      <MintModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
