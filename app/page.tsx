import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex ">
      <Link href="/sign-in">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Go to Sign In
        </button>
      </Link>

      <Link href="/sign-up">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Go to Sign Up
        </button>
      </Link>
    </div>
  );
}
