# Multi-tab

A browser extension to open and group a bunch of tabs from a list of URLs.

---

## Permissions

| Permission | Description | Justification |
| --- | --- | --- |
| `tabs` | Read your browsing history | Enumerate tabs, and access their URLs |
| `tabGroups` | View and manage your tab groups | Enumerate tab groups, and move tabs into them |

## Credits

Logo is `ic_fluent_book_open_globe_24_regular.svg` from [Microsoft's Fluent System Icons pack](https://github.com/microsoft/fluentui-system-icons).

## Hacking

Build the extension with:

```console
task -w extension:build
```

Leave this running in a tab, and run the following to launch browser instances with the extension loaded for testing:

```console
task run:chrome
task run:firefox
```

As you make changes to the extension, just reload the tab to see your changes.
