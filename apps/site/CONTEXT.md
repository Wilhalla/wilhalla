# Wilhalla Website

Wilhalla is the public website for the Wilhalla garden, wellbeing, yoga, rental, agenda, gallery, and contact presence. This context names the site concepts used by the frontend modules.

## Language

**Interactive Map**:
The hand-drawn homepage map that lets visitors discover Wilhalla places through hover, intro highlights, labels, and navigation.
_Avoid_: map widget, hero component

**Map Sentinel**:
A rectangular discovery zone on the Interactive Map that can reveal painted overlays, text labels, and an explanation.
_Avoid_: hover box, hit area

**Map Hotspot**:
A traced SVG path on the Interactive Map that behaves like a navigable place link.
_Avoid_: clickable path, overlay button

**Agenda**:
The public calendar of Wilhalla activities, workshops, yoga, and gatherings.
_Avoid_: events service, calendar page

**Editorial Page**:
A content-led Wilhalla page published from Markdown, page metadata, and optional breadcrumb or subpage navigation.
_Avoid_: markdown route, content component

**Page Registry**:
The typed collection of Wilhalla page titles, descriptions, intros, breadcrumbs, and subpage navigation.
_Avoid_: page config blob

**Site Identity**:
The canonical public identity of Wilhalla: name, URL, locale, theme metadata, and shared web assets.
_Avoid_: app config
