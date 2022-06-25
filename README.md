# Multi-tab

A browser extension to open and group a bunch of tabs from a list of URLs.

---

## Installation

- [Chrome Web Store](https://chrome.google.com/webstore/detail/multi-tab/aecmnemhogbiohkomdlbgklhlamaihhi) for Brave, Chrome, and Vivaldi
- [Mozilla Addons](https://addons.mozilla.org/firefox/addon/lukecarrier-multi-tab/) for Firefox
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/multitab/mnaahaibjhogpcngmpcdneiaccnmccdh) for Edge

### Installation on Safari

1. Install the app to `/Applications`.
2. Open _Safari_, then click _Safari_ -> _Preferences_.
3. From the _Advanced_ tab, check _Show Develop menu in menu bar_.
4. Ensure _Develop_ -> _Allow Unsigned Extensions_ is checked.
5. From the _Extensions_ tab, enable _Multi-tab_.

Until we figure out code signing, you'll need to repeat (4) each time Safari is relaunched.

## Privacy policy

This really ought not to be necessary, but to be exceptionally clear:

> This browser extension doesn't collect any data: personal, telemetry, or otherwise.

I take your privacy very seriously. No third-party analytics or advertising services are used. The extension logs no information on you and has no interest in doing such.

Neither the extension nore the developer collects, transmits, distributes, or sells your data.

### Permissions

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

### Hacking on Safari

iOS and macOS Safari builds require Xcode, as we must wrap the extension in an iOS and macOS app for distribution. After installing Xcode via the App Store, switch to its developer directory for `xcodebuild`:

```console
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

You should then be able to build the extension and apps:

```console
task extension:safari:build
```
