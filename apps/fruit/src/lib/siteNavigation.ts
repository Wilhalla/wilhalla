import { Archive, ChartNoAxesColumn, Database, House, Images, Map } from "lucide-react";

/** The main menu, in order: the header and the small-screen menu render the same list. */
export const siteNavigation = [
  { href: "/", label: "Home", Icon: House },
  { href: "/archive/", label: "Alle berichten", Icon: Archive },
  { href: "/gallery/", label: "Beeldarchief", Icon: Images },
  { href: "/onderwerpen/", label: "Onderwerpen", Icon: Map },
  { href: "/stats/", label: "Statistieken", Icon: ChartNoAxesColumn },
  { href: "/data/", label: "Data", Icon: Database },
];
