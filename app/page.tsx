'use client'

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Band } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

const BandLink = (props: {
  name: string;
  id: string;
}) => (
  <Link
    className="hover:underline"
    href={{
      pathname: "/band",
      query: {
        name: props.name,
        id: props.id
      }
    }}
  >
    {props.name}
  </Link>
)

export default function Home() {
  const [bands, setBands] = useState<Band[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // const response = await fetch('/api/home');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}:${process.env.NEXT_PUBLIC_API_PORT}/band/`)

      return response.json();
    }

    fetchData().then((res) => {
      console.log(res)
      setBands(res)
    });
  }, [])

  return (
    <main className="py-[1rem] flex-col">
      <Header />
      <div className="py-[1rem] w-full">
        <Separator />
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row gap-[1rem] p-[1rem]">
        <div className="flex flex-col">
          { bands.map((b, i) => <BandLink key={i} id={`${b.id}`} name={b.name} />) }
        </div>
      </div>
    </main>
  );
}
