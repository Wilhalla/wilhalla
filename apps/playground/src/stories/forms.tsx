import { Button } from "@wilhalla/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wilhalla/ui/components/collapsible";
import { Slider } from "@wilhalla/ui/components/slider";
import { Input } from "@wilhalla/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@wilhalla/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { Switch } from "@wilhalla/ui/components/switch";
import { Textarea } from "@wilhalla/ui/components/textarea";
import { Search, X } from "lucide-react";

import { Example, Examples, type Story } from "./story";

export const inputStory: Story = {
  id: "input",
  title: "Input · Textarea",
  source: "@wilhalla/ui/components/input",
  description: "Underlined text fields. Focus them to see the focus state.",
  render: () => (
    <Examples>
      <Example label="placeholder">
        <Input placeholder="Zoek in het archief" />
      </Example>
      <Example label="with value">
        <Input defaultValue="appelbomen snoeien" />
      </Example>
      <Example label="disabled">
        <Input placeholder="Niet beschikbaar" disabled />
      </Example>
      <Example label="aria-invalid">
        <Input defaultValue="jan@" aria-invalid />
      </Example>
      <Example label="Textarea">
        <Textarea placeholder="Je reactie" />
      </Example>
      <Example label="Textarea disabled">
        <Textarea placeholder="Reageren is gesloten" disabled />
      </Example>
    </Examples>
  ),
};

export const inputGroupStory: Story = {
  id: "input-group",
  title: "InputGroup",
  source: "@wilhalla/ui/components/input-group",
  description: "An input with icons, text or buttons inside the field.",
  render: () => (
    <Examples>
      <Example label="leading icon">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Zoeken" />
        </InputGroup>
      </Example>
      <Example label="trailing text and clear button">
        <InputGroup>
          <InputGroupInput defaultValue="peren" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>124 resultaten</InputGroupText>
            <InputGroupButton size="icon-xs" aria-label="Wissen">
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Example>
    </Examples>
  ),
};

export const selectStory: Story = {
  id: "select",
  title: "Select",
  source: "@wilhalla/ui/components/select",
  description: "Open a select to see the menu, its hover and the checked item.",
  render: () => (
    <Examples>
      {(["default", "sm"] as const).map((size) => (
        <Example key={size} label={`size="${size}"`}>
          <Select defaultValue="2012">
            <SelectTrigger size={size} className="w-44">
              <SelectValue placeholder="Jaar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Jaar</SelectLabel>
                {["2010", "2011", "2012", "2013"].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Example>
      ))}
      <Example label='variant="outline" · variant="inverse"'>
        <Select defaultValue="chronological">
          <SelectTrigger variant="outline" size="sm" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chronological">Chronologisch</SelectItem>
            <SelectItem value="random">Willekeurig</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-2xl bg-obsidian p-3">
          <Select defaultValue="5">
            <SelectTrigger variant="inverse" size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 sec per beeld</SelectItem>
              <SelectItem value="8">8 sec per beeld</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Example>
      <Example label="placeholder · disabled">
        <Select>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Kies een jaar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2005">2005</SelectItem>
          </SelectContent>
        </Select>
        <Select disabled>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Niet beschikbaar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">x</SelectItem>
          </SelectContent>
        </Select>
      </Example>
    </Examples>
  ),
};

export const sliderStory: Story = {
  id: "slider",
  title: "Slider · Collapsible",
  source: "@wilhalla/ui/components/{slider,collapsible}",
  description:
    "A range (zoom in the image viewer) and a disclosure (long values in the data tables).",
  render: () => (
    <Examples>
      <Example label="Slider">
        <Slider className="w-56" defaultValue={[2]} min={1} max={4} step={0.25} aria-label="Zoom" />
      </Example>
      <Example label="Collapsible">
        <Collapsible className="w-full max-w-sm">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Toon volledige tekst
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="m-0 mt-2 text-body text-cinder">
              De gele bloemen van de kornoeljebessen zijn nu ver uitgebloeid.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </Example>
    </Examples>
  ),
};

export const switchStory: Story = {
  id: "switch",
  title: "Switch",
  source: "@wilhalla/ui/components/switch",
  description: "On, off and disabled.",
  render: () => (
    <Examples>
      <Example label="off · on">
        <Switch aria-label="Uit" />
        <Switch aria-label="Aan" defaultChecked />
      </Example>
      <Example label="disabled off · on">
        <Switch aria-label="Uit" disabled />
        <Switch aria-label="Aan" disabled defaultChecked />
      </Example>
    </Examples>
  ),
};
