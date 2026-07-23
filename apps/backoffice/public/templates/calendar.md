Build a page: Calendar (appointments)

Route:        /calendar  (client page — put metadata in a sibling layout.tsx)
Page type:    #3 Dashboard-style frame (flex h-full flex-col -> action header
              with <Breadcrumbs/> -> content min-h-0 flex-1 overflow-y-auto).
Nav:          add to nav-config.ts so sidebar + breadcrumbs derive it.

Views (a segmented switcher, top-right):
  - Month  — 6-week grid, event chips per day, "+N more" overflow.
  - Week   — 7 day columns over a scrollable 24-hour grid.
  - Day    — single day column over the same 24-hour grid.
  Week + Day show AM/PM hour labels, a red current-time line, and auto-scroll
  the current time into view on open.

Event model:
  Ev { id, date (yyyy-MM-dd), start "HH:mm", end "HH:mm", title,
       color (label key), type, guests?, meet?, location?, description?, notify }
  In Week/Day, blocks are positioned by start and sized by duration;
  overlapping events split into side-by-side columns (lane assignment).

Color labels:  Google-style palette (Blueberry, Tomato, Tangerine, Banana,
               Sage, Peacock, Lavender, Grape, Graphite) as static Tailwind
               classes — same convention as TAB_COLORS. Chosen color drives the
               block/chip color.

Add appointment (Dialog):
  - Title (borderless, live color accent) + Event/Task/Appointment tabs.
  - Date + start–end time via the app Select (15-min slots, "9:00 AM" labels) —
    NOT native <input type="time"> (ugly clock/panel).
  - Color swatch picker.
  - "More options" progressive disclosure: guests, Google Meet toggle,
    location, description, notify Select.
  - Blue primary Save; Cancel. Enter in the title saves.

Building blocks:  Dialog, Input, Select, Checkbox, Button, Breadcrumbs, cn,
                  date-fns. No new dependency; no hand-rolled table/time picker.

Test scenarios (happy / unhappy):
  TC-1  Switch Month/Week/Day                 -> grid re-renders, heading updates
  TC-2  Add appointment with title + time     -> block/chip appears in the right slot + color
  TC-3  Save with empty title                 -> Save disabled, nothing added
  TC-4  End <= start                          -> end auto-corrected to start + 1h
  TC-5  Pick a color                          -> block renders in that color
  TC-6  Open Week/Day on today                -> current-time line shown, scrolled into view
  TC-7  Click an event                        -> removed (demo behavior)
  TC-8  "More options"                        -> guests/meet/location/description/notify revealed

Done when: three views work, AM/PM everywhere, current-time line + auto-scroll,
color labels, the Select-based time picker, the scenarios above pass, tokens,
light + dark, a11y, lint + types + build pass.
