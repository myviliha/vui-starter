Build a page: Support & ticketing (help-desk ticketing system)

Route:        /support  (client page — metadata in a sibling layout.tsx)
Nav:          add to nav-config.ts under the "shadcn/ui" section.
Page frame:   flex h-full flex-col -> action header with <Breadcrumbs/> ->
              content min-h-0 flex-1 (three-pane inside one card, p-4).

This is a ticketing system, NOT a chat. Three regions:
  - Left (w-80, border-r): ticket queue. Search Input (subject / ref /
    requester) + a status-filter Select over a scrollable list. Each row:
    subject, status badge, priority dot, ref (TCK-####), requester, updated.
    Active row tinted bg-accent.
  - Center: detail header (status badge, ref, subject) -> the original request
    -> a stacked ACTIVITY TIMELINE (avatar + author + role + time + text, each a
    bordered card, all left-aligned — not left/right chat bubbles) -> a reply
    textarea + "Send reply" button. Sending appends a comment and sets status
    -> Pending.
  - Right (w-60, border-l, hidden < lg): properties rail — editable status +
    priority Selects, requester, assignee, last updated.

Data model:
  Status   = "open" | "pending" | "resolved"
  Priority = "low" | "medium" | "high" | "urgent"
  Comment  { id, author, role: "agent" | "customer", text, time }
  Ticket   { id, ref, subject, requester, assignee, status, priority, updated,
             description, comments: Comment[] }

Colors:       status badges + priority dots use static Tailwind classes keyed by
              value (same convention as TAB_COLORS / calendar labels), light+dark.
Building blocks:  Input, Select, Button, cn, Breadcrumbs, SetPageTitle, date-fns.
                  The queue is buttons; for sorting/columns/bulk actions switch to
                  RecordView (see /docs/data-table). No table/chat dependency.

Test scenarios (happy / unhappy):
  TC-1  Select a ticket             -> detail + activity + properties switch, row active
  TC-2  Change status / priority    -> Select updates the ticket + badge/dot
  TC-3  Filter by status            -> queue narrows to that status
  TC-4  Send a reply                -> comment appended to timeline, status -> Pending
  TC-5  Reply empty                 -> Send disabled, nothing added
  TC-6  Search by ref/requester     -> queue filters; empty -> "No tickets found."

Done when: queue + detail + properties render, search & status filter work,
status/priority editable, reply appends to the timeline, badge/dot colors from
the maps, the scenarios above pass, light + dark, a11y, lint + types + build pass.
