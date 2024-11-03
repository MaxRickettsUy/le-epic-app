import { z } from "zod";

export interface Member {
  name: string;
  role: string;
}

export interface FlaskBand {
  band_picture: string;
  id: number;
  name: string;
  status: "active";
}

export interface Band {
  band_picture: string;
  id: number;
  name: string;
  status: "active" | "unknown" | "inactive" | "split-up";
  members: Member[],
  // discography: Album[]
  discography: Release[]
}

// export interface Album {
//   name: string;
//   bandName: string;
//   year: number;
//   label: string;
//   rating: number;
//   reviewCount: number;
//   songs: Song[];
// }

export interface User {
  name: string;
}

export interface Review {
  author: User;
  release: Release;
  date: string;
}

export interface Song {
  name: string;
  length: string;
  lyrics?: string;
}

export interface Release {
  release_name: string,
  name: string;
  status: "active" | "split-up" | "unknown" | 'inactive',
  band_picture: string,
  release_id: number,
  year: number,
  review_avg: number,
  review_count: number
}