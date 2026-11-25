import { redirect } from "next/navigation"
import { PATHS } from "@/src/constants/paths"

export default function ProfilePage() {
  redirect(PATHS.profile.ebooks)
}
