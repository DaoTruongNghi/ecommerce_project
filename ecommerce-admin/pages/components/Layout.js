import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./nav";

export default function Layout({ children }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="p-2 px-4 bg-white rounded-lg"
          >
            Login with google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-md p-4">
        {children}
      </div>
    </div>
  );
}
