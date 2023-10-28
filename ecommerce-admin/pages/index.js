import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "./components/Layout";

export default function Home() {
  const { data: session } = useSession();
  // console.log(session);
  if (!session) return;
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <div>
          <h2>
            Hello, <b>{session?.user?.name}</b>
          </h2>
        </div>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6"></img>
          <span className="px-1">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
