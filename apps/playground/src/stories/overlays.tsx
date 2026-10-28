import { Button } from "@wilhalla/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@wilhalla/ui/components/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wilhalla/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wilhalla/ui/components/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@wilhalla/ui/components/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@wilhalla/ui/components/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@wilhalla/ui/components/tooltip";
import { Shuffle } from "lucide-react";

import { Example, Examples, type Story } from "./story";

export const overlayStory: Story = {
  id: "overlays",
  title: "Dialog · Sheet · Popover · Tooltip · DropdownMenu",
  source: "@wilhalla/ui/components/{dialog,sheet,popover,tooltip,dropdown-menu}",
  description: "Click or hover the triggers; Escape closes. These open in a portal over the page.",
  render: () => (
    <Examples>
      <Example label="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bericht delen</DialogTitle>
              <DialogDescription>Kopieer de link naar dit archiefbericht.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuleren</Button>
              </DialogClose>
              <Button>Kopieer link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>
      <Example label="Sheet (each side)">
        {(["right", "left", "top", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Kies jaren en onderwerpen.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ))}
      </Example>
      <Example label="Popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Info</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Bron</PopoverTitle>
              <PopoverDescription>Seniorennet-blog, 2005–2020.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </Example>
      <Example label="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Willekeurig bericht">
                <Shuffle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Willekeurig bericht</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Example>
      <Example label="DropdownMenu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Weergave</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Toon</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked>Afbeeldingen</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Reacties</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Alles tonen</DropdownMenuItem>
            <DropdownMenuItem disabled>Exporteren</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </Examples>
  ),
};

export const commandStory: Story = {
  id: "command",
  title: "Command",
  source: "@wilhalla/ui/components/command",
  description:
    "Searchable command list (cmdk), shown inline; `CommandDialog` opens it in a dialog.",
  render: () => (
    <Examples>
      <Example label="inline">
        <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-subtle-2">
          <Command>
            <CommandInput placeholder="Zoek een pagina" />
            <CommandList>
              <CommandEmpty>Niets gevonden.</CommandEmpty>
              <CommandGroup heading="Pagina's">
                <CommandItem>
                  Alle berichten <CommandShortcut>A</CommandShortcut>
                </CommandItem>
                <CommandItem>Beeldarchief</CommandItem>
                <CommandItem disabled>Atlas (laden…)</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Jaren">
                <CommandItem>2012</CommandItem>
                <CommandItem>2013</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Example>
    </Examples>
  ),
};
