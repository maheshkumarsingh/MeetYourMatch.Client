import { Photo } from "./photo"

export interface Member {
  id: number
  userName: string
  age: number
  photoURL: string
  knownAs: string
  createdAt: Date
  updatedAt: Date
  gender: string
  introduction: string
  interests: string
  lookingFor: string
  city: string
  country: string
  photos: Photo[]
}
