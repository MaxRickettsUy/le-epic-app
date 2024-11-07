'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { countries } from "@/lib/const";
import { Band } from "@/lib/types";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";

const StatusSelect = (props: {
  defaultValue: string;
  onChange: (name: string, value: string) => void;
}) => (
  <Select
    defaultValue={props.defaultValue}
    onValueChange={(s) => props.onChange('status', s)}
  >
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
  <Select onValueChange={(c) => props.onChange("country", c)}>
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
  const [typing, setTyping] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const requiredFields: BandKey[] = ["name", "status"];

  useEffect(() => {
    const id: number = Number(searchParams.get("id"));

    const fetchData = async (params: { id: number }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}:${process.env.NEXT_PUBLIC_API_PORT}/band/${params.id}`)

      return res.json();
    }

    if (id !== null) {
      fetchData({ id }).then((res: Band) => {
        console.log(res)

        const band: Band = {
          ...res,
          members: [],
        }

        console.log(band)

        setBandForm(band);
      })
    }
  }, [searchParams])

  const handleInputChange = (key: BandKey, e: ChangeEvent<HTMLInputElement>) => {
    setBandForm({
      ...bandForm,
      [key]: e.target.value === '' ? null : e.target.value
    })

    if (typing) {
      setTyping(false);
    }
  }

  const debounceInput = _.debounce(handleInputChange, 1000)

  const handleSelect = (key: string, value: string) => {
    setBandForm({
      ...bandForm,
      [key]: value
    })
  }

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

  const submitDisabled = useMemo(() => {
    let disabled = false;

    requiredFields.forEach((f: BandKey) => {
      if (bandForm[f] === null || typeof bandForm[f] === "undefined" ) {
        disabled = true;
      }
    })

    return disabled;
  }, [bandForm]);

  console.log(bandForm)

  return (
    <main className="py-[1rem] flex-col">
      <Header />
      <div className="py-[1rem] w-full">
        <Separator />
      </div>
      <div className="flex flex-col gap-[1rem] p-[1rem]">
        <div className="flex flex-row">
          <div className="flex flex-col gap-[1rem]">
            <span className="text-4xl">Edit Band</span>
            <Input
              defaultValue={bandForm.name}
              onChange={(e) => {
                if (!typing) {
                  setTyping(true);
                }
                debounceInput('name', e);
              }}
              type="text"
              placeholder="Name"
            />
            <CountrySelect onChange={handleSelect} />
            <Input type="text" placeholder="City" />
            <Input type="text" placeholder="State" />
            <StatusSelect defaultValue={bandForm.status} onChange={handleSelect} />
            <Button disabled={submitDisabled || typing} onClick={() => handleSubmit(bandForm)}>Submit</Button>
          </div>
        </div>
        <span>{JSON.stringify(bandForm)}</span>
      </div>
    </main>
  );
}