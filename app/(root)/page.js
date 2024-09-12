import Image from "next/image";
import Navbar from "../../components/navbar";
import Search from "../../components/search";
import Trending from "../../components/trending";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Trending />
      </div>
    </main>
  );
}
