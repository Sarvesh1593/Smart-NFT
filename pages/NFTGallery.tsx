"use client";
import { useEffect, useState } from "react";
import { usePublicClient, useChainId } from "wagmi";
import { abi, contractAddress } from "../constant/index";
import NFTBox from "@/component/NFTBox";
import { useAccount } from "wagmi";

export default function NFTGallery() {
  const { address: userAddress } = useAccount();
  const client = usePublicClient();
  const [nfts, setNfts] = useState<
    {
      tokenId: number;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  const chainId = useChainId(); // Already a number
  const contractAddr = (contractAddress as Record<string, string[]>)[
    chainId.toString()
  ]?.[0];

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!userAddress) return;

      const nftList = [];
      const tokenIds = (await client?.readContract({
        address: contractAddr as `0x${string}`,
        abi,
        functionName: "getAllTokenIds",
        args: [],
      })) as bigint[];

      for (let tokenId = 0; tokenId < tokenIds.length; tokenId++) {
        try {
          const owner = (await client?.readContract({
            address: contractAddr as `0x${string}`,
            abi: abi,
            functionName: "ownerOf",
            args: [BigInt(tokenId)],
          })) as string;

          if (owner.toLowerCase() !== userAddress.toLowerCase()) continue;

          const tokenURI = (await client?.readContract({
            address: contractAddr as `0x${string}`,
            abi: abi,
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

          nftList.push({
            tokenId,
            name: metadata.name,
            description: metadata.description,
            image: imageURL,
          });
        } catch (err) {
          console.warn(`Token ${tokenId} failed to load`, err);
        }
      }

      setNfts(nftList);
    };

    if (client && contractAddr && userAddress) {
      fetchNFTs();
    }
  }, [client, contractAddr, userAddress]);
  // ✅ Only run when client or address changes

  return (
    <div className="bg-black p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Collection</h2>
      <div
        id="collection"
        className="flex overflow-x-auto p-4 bg-black min-h-[300px]"
      >
        {nfts.length > 0 ? (
          nfts.map((nft) => (
            <NFTBox
              key={nft.tokenId}
              tokenId={nft.tokenId}
              imageURI={nft.image}
              tokenName={nft.name}
              tokenDescription={nft.description}
              allowListing={true}
            />
          ))
        ) : (
          <div className="text-white text-center w-full">
            No NFTs owned by this wallet.
          </div>
        )}
      </div>
    </div>
  );
}
