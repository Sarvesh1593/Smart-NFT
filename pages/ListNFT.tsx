"use client";

import NFTBox from "@/component/NFTBox";
import { abi, contractAddress } from "@/constant";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient, useWriteContract } from "wagmi";
import { parseEther } from "viem";

interface ListedNFT {
  tokenId: number;
  price: string;
  seller: bigint;
  name: string;
  description: string;
  image: string;
}
export default function ListNFT() {
  const client = usePublicClient();
  const chainId = useChainId();
  const contractAddr = (contractAddress as any)[chainId.toString()]?.[0];
  const [listedNfts, setListedNfts] = useState<ListedNFT[]>([]);
  const { writeContract } = useWriteContract();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [ids, prices, seller] = (await client?.readContract({
          address: contractAddr,
          abi: abi,
          functionName: "getAllListings",
          args: [],
        })) as [bigint[], bigint[], bigint[]];

        const result: ListedNFT[] = [];

        for (let i = 0; i < ids.length; i++) {
          const tokenId = Number(ids[i]);
          const tokenURI = (await client?.readContract({
            address: contractAddr,
            abi,
            functionName: "tokenURI",
            args: [BigInt(tokenId)],
          })) as string;
          const metadataURL = tokenURI.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
          const metadata = await fetch(metadataURL).then((res) => res.json());

          const imageURL = metadata.image.replace(
            "ipfs://",
            "https://copper-selected-lungfish-220.mypinata.cloud/ipfs/"
          );

          result.push({
            tokenId,
            price: (Number(prices[i]) / 1e18).toFixed(5),
            seller: seller[i],
            name: metadata.name,
            description: metadata.description,
            image: imageURL,
          });
        }
        setListedNfts(result);
      } catch (err) {
        console.error("Failed to load listings", err);
      }
    };
    if (client && contractAddr) {
      fetchListings();
    }
  }, [client, contractAddr]);
  return (
    <div className="p-6 bg-black">
      <h2 className="text-2xl fond bold mb-4 text-white">Listed NFT</h2>
      {listedNfts.length === 0 ? (
        <p className="text-white text-center">No NFTs listed for sale</p>
      ) : (
        <div className="flex overflow-x-auto p-4 bg-black min-h-[300px]">
          {listedNfts.map((nft) => (
            <NFTBox
              key={nft.tokenId}
              tokenId={nft.tokenId}
              imageURI={nft.image}
              tokenName={nft.name}
              tokenDescription={nft.description}
              tokenPrice={nft.price}
              allowListing={false}
              onBuy={async () => {
                try {
                  const tokenId = BigInt(nft.tokenId);
                  const value = parseEther(nft.price);
                  console.log("Attempting to buy:", { tokenId, value });

                  const result = await writeContract({
                    address: contractAddr,
                    abi,
                    functionName: "buyItem",
                    args: [tokenId],
                    value,
                  });

                  console.log("Transaction sent", result); // result is undefined by default
                } catch (err) {
                  console.error("Transaction failed:", err);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
