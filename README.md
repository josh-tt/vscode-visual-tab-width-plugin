# Visual Tab Width

## Make your tabs appear wider without changing your indentation settings

Visual Tab Width is a VS Code extension that allows you to visually increase the width of your tabs without altering your actual indentation settings. This extension is for developers who prefer to keep their 2-space indentation for their code but want a more visually distinct separation between indentation levels (as if it was 4).

### Features

-   Customize the visual width of tabs while maintaining your preferred indentation settings
-   Seamlessly integrates with VS Code's existing tab size configuration
-   Adjustable multiplier to control the visual width of tabs
-   Status bar indicator showing current tab width
-   Quick access to settings and controls via status bar

### How it works

This extension multiplies the visual width of your tabs by a configurable factor. For example, if you have your tab size set to 2 and use a multiplier of 2, your tabs will visually appear as 4 spaces wide, while still being 2 in the actual file.

### Usage

1. The extension is active by default when installed.
2. A "Tab Width: n" indicator will appear in the status bar, showing the current visual tab width.
3. Click on the "Tab Width: n" indicator in the status bar to access quick options:
    - Set Tab Width: Directly set the desired visual tab width
    - Set Multiplier: Adjust the multiplier used to calculate the visual tab width
    - Enable/Disable Wider Tabs: Toggle the extension on or off
    - Hide/Show Indent Guides: Quickly toggle VS Code's built-in indent guides

### Configuration

You can adjust the visual tab width multiplier in your VS Code settings:

1. Open VS Code settings (File > Preferences > Settings)
2. Search for "Visual Tab Width"
3. Adjust the multiplier. If 2 is tabs, multiply by 2 to get 4.
4. NOTE: You can also use the toolbar settings on the bottom.

### Developers working on plugin

npm run compile and then npx vsce package
