import type { Metadata } from "next";
import { MyDapps } from "@/components/dapps/my-dapps";

export const metadata: Metadata = { title: "My dApps" };

export default function MyPage() {
  return (
    <div className="mx-auto max-w-300 px-5 py-12 sm:px-10 lg:border-x lg:border-line">
      <h1 className="mb-8 text-4xl">My dApps</h1>
      <MyDapps />
    </div>
  );
}
