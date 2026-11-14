import { getPage } from "@/content/pages";
import { CalendarDays, Flower2, HeartPulse, Images, TentTree, UsersRound } from "lucide-react";

/** The main menu, in order: desktop navbar and mobile menu render the same list. */
export const navigationLinks = [
  { page: getPage("tuin"), Icon: UsersRound },
  { page: getPage("welzijn"), Icon: HeartPulse },
  { page: getPage("yoga"), Icon: Flower2 },
  { page: getPage("verhuur"), Icon: TentTree },
  { page: getPage("agenda"), Icon: CalendarDays },
  { page: getPage("galerij"), Icon: Images },
];

export const contactPage = getPage("contact");
