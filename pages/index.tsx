import Header from "../component/Header";
import Mint from "../component/Mint";
import NFTGallery from "./NFTGallery";
import ListNFT from "./ListNFT";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Mint />
        <div>
          <NFTGallery />
        </div>
        <ListNFT />
      </main>
    </div>
  );
}
