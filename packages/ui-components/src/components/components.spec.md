# UI Components in this package.

This is a high level spec to identify what components are and how they operate.

## Button

-   Primary variant: colored background, hover effects
-   Secondary variant: transparent with colored text
-   States: normal, loading (spinner animation), disabled
-   Icon or text or both

## Button Group

-   Button group is a group of buttons
-   Button groups are horizontal
-   Button groups take in a list of buttons

## Sidebar

-   Sidebar is a vertical component of fixed pixel width
-   Sidebar children are of type SidebarSection or SidebarButton
-   Sidebars have a title text and an optional title action which is a react node rendered on the right side of the title text
-   Sidebar buttons have an active state, hover effects, an icon, a label, and flags for closable and in progress states
-   Sidebar buttons have props for onClick & onClose
