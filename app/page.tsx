'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Band } from "@/lib/types";
import { useRouter } from "next/navigation";

const SearchInput = () => (
  <Input type="search" placeholder="Search..." />
);

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
      <div className="flex flex-row gap-[1rem] px-[1rem]">
        <Avatar>
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        {/* <NavigationMenuDemo /> */}
        <div className="ml-auto flex flex-row gap-[1rem]">
          <Button
            onClick={() => router.push("/create/band")}
          >
            Add Band
          </Button>
          <SearchInput />
        </div>
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
      <div className="py-[1rem] w-full">
        <Separator />
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row gap-[1rem] p-[1rem]">
        <div className="flex flex-col">
          { bands.map((b, i) => <BandLink key={i} id={b.id} name={b.name} />) }
        </div>
      </div>
    </main>
  );
}
