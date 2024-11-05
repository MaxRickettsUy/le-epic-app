'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { countries } from "@/lib/const";
import { Band } from "@/lib/types";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import _ from 'lodash';

const SearchInput = () => (
  <Input type="search" placeholder="Search..." />
);

const StatusSelect = (props: {
  onChange: (name: string, value: string) => void;
}) => (
  <Select defaultValue="active" onValueChange={(s) => props.onChange('status', s)}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="unknown">Unknown</SelectItem>
      <SelectItem value="on-hold">On Hold</SelectItem>
      <SelectItem value="split-up">Split Up</SelectItem>
    </SelectContent>
  </Select>
)

const CountrySelect = (props: {
  onChange: (name: string, value: string) => void;
}) => (
  <Select defaultValue="US" onValueChange={(c) => props.onChange("country", c)}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Country" />
    </SelectTrigger>
    <SelectContent>
      { countries.map((c, i) => (
        <SelectItem key={i} value={c.code}>
          {c.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

type BandKey = keyof Band;

export default function Page() {
  const [bandForm, setBandForm] = useState<Band>({ status: "active", band_picture: "foo" } as Band);

  const handleInputChange = (key: BandKey, e: ChangeEvent<HTMLInputElement>) => {
    setBandForm({
      ...bandForm,
      [key]: e.target.value
    })
  }

  const debounceInput = _.debounce(handleInputChange, 500)

  const handleSelect = (key: string, value: string) => {
    setBandForm({
      ...bandForm,
      [key]: value
    })
  }

  console.log(bandForm)

  const handleSubmit = (band: Band) => {
    const submitBand = async (params: {
      band: Band
    }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}:${process.env.NEXT_PUBLIC_API_PORT}/band/create`, {
        method: "POST",
        body: JSON.stringify(params.band),
        headers: {
          "Content-Type": "application/json"
        }
      })

      return response.json();
    }

    submitBand({ band }).then((res) => {
      console.log(res)
    })
  }

  return (
    <main className="py-[1rem] flex-col">
      <div className="flex flex-row gap-[1rem] px-[1rem]">
        <Link href="/">
          <Avatar>
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
        </Link>
        {/* <NavigationMenuDemo /> */}
        <div className="ml-auto flex flex-row gap-[1rem]">
          <Button>Add Band</Button>
          <SearchInput />
        </div>
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
      <div className="py-[1rem] w-full">
        <Separator />
      </div>
      <div className="flex flex-col gap-[1rem] p-[1rem]">
        <div className="flex flex-row">
          <div className="flex flex-col gap-[1rem]">
            <span className="text-4xl">Add Band</span>
            <Input onChange={(e) => debounceInput('name', e) } type="text" placeholder="Name" />
            <CountrySelect onChange={handleSelect} />
            <Input type="text" placeholder="City" />
            <Input type="text" placeholder="State" />
            <StatusSelect onChange={handleSelect} />
            <Button onClick={() => handleSubmit(bandForm)}>Submit</Button>
          </div>
        </div>
      </div>
    </main>
  );
}