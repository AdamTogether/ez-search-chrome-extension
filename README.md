# EZ Search (Bookmark Manager and Navigator)

A lightweight Chrome extension for opening and managing your bookmarks quickly, using only the keyboard.

[![Screenshot of the EZ Search extension](https://raw.githubusercontent.com/AdamTogether/ez-search-chrome-extension/refs/heads/main/Example%201.png)](https://chromewebstore.google.com/detail/ez-search-bookmark-manage/himmefjcbpgbibcnigdobfnnekpkbbkc)

---

> [!CAUTION]
> **Export your data regularly.**
>
> All EZ Search bookmark data is stored in your browser's **Local Storage**. If you clear your browser's cache, cookies, or site data, your bookmarks will be **permanently deleted**. Use the **Export** button to keep a backup.

---

## Getting Started

1. Install EZ Search from the [Chrome Web Store](https://chromewebstore.google.com/detail/ez-search-bookmark-manage/himmefjcbpgbibcnigdobfnnekpkbbkc).
2. Set a keyboard shortcut to open it:
   - Go to **Extensions → Manage Extensions → Keyboard Shortcuts**, or open `chrome://extensions/shortcuts` directly.
   - Assign a shortcut to EZ Search. <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> is recommended.
3. Bring in your existing bookmarks. See [Import](#import) below.

A welcome guide appears the first time you open EZ Search. You can reopen it at any time with the **?** button in the bottom-right corner.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> | Launch EZ Search (recommended binding) |
| <kbd>Esc</kbd> | Close pop-ups, clear the search bar, or move focus from a link back to the search bar |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Move between visible links |
| <kbd>Enter</kbd> | Open the focused link in the current tab |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Open the focused link in a new background tab |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> | Open the focused link in a new tab and switch to it |

For the three <kbd>Enter</kbd> shortcuts: if the search bar has focus, they open the **first result** instead.

## Features

- **Search:** Filter bookmarks by title, URL, or tags. When you type several keywords, only links that match *all* of them are shown.
- **Tags:** Add tags to links to organize them. Click any tag pill to add it to, or remove it from, the search bar.
- **Add New Link:** Save a bookmark with a title, a URL, and optional tags.
  - Advanced options let you set a custom favicon, either as a URL or as a Base64-encoded image.
- **Edit and Delete:** Every link card has its own **Edit** and **Delete** buttons.
- **Drag and Drop:** Drag links to reorder them however you like.
- **Dark Mode:** Switch between light and dark themes with the moon/sun button at the top.

## Export and Import

### Export

Click the **Export** button at the top.

- This downloads a `.json` file containing all of your bookmarks.
- Keep this file somewhere safe as a backup.

### Import

Click the **Import** button at the top. Two file types are supported:

| Source | Format | How to get it |
|---|---|---|
| **EZ Search** | `.json` | Use the **Export** button in EZ Search |
| **Google Chrome** | `.html` | Open `chrome://bookmarks`, click the **⋮** menu, then choose **Export bookmarks** |

Links whose URL already exists in EZ Search are skipped, so duplicates aren't created.

## Privacy

- All bookmarks are stored locally in your browser.
- There's no account to create.

## Built With

- HTML
- [Tailwind CSS](https://tailwindcss.com/)
- Modular JavaScript
- [Font Awesome](https://fontawesome.com/) icons

## Install from the Chrome Web Store

[![Install from the Chrome Web Store](https://raw.githubusercontent.com/AdamTogether/ez-search-chrome-extension/refs/heads/main/chrome-web-store-badge-for-colored-bg.png)](https://chromewebstore.google.com/detail/ez-search-bookmark-manage/himmefjcbpgbibcnigdobfnnekpkbbkc)
