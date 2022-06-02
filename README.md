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
task run:safari
```

As you make changes to the extension, just reload the tab to see your changes.

### Hacking on Safari

iOS and macOS Safari builds require Xcode, as we must wrap the extension in an iOS and macOS app for distribution. After installing Xcode via the App Store, switch to its developer directory for `xcodebuild`:

```console
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

You should then be able to build the extension and apps:

```console
task extension:safari:build
```
