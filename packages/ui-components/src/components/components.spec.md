# UI Components in this package.

<instructions-for-llm>
    Read the git diff on this file so you can see what has changed. You will have to run the git diff command yourself here.
    Use this diff as the intended user action. If lines are added, update the workspace to match the diff. If lines are removed, remove the component from the workspace.

    Command:

    ```
    git --no-pager diff [FILE]
    ```

    Note that this is the source of truth for the components in this package.
    If the component doesnt list details about disabled state, hover state, or active state, then it does not have those features
    Consider only the changes and dont touch the implementations of other components outside of the user changes.

    We use tailwind css, follow the other components for styling and structure please!

</instructions-for-llm>

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

## Select dropdown

-   Select dropdown is a dropdown that allows the user to select an option
-   Select dropdown has onSelect, selected id, and options of type {id: string, label: string}
