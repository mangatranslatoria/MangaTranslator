# Manga Translator Studio - Replaceable assets

## Logo / icons

Replace these files without editing HTML/CSS:

- `assets/logo/logo.png` — main website logo / favicon reference
- `assets/logo/app-icon-light.png` — light icon reference
- `assets/logo/app-icon-dark.png` — dark icon reference
- `assets/logo/app-icon-light.ico` — Windows app icon reference
- `assets/logo/app-icon-dark.ico` — Windows app icon reference

Suggested use:

- Website favicon: `assets/logo/logo.png`
- Desktop app light theme icon: `assets/logo/app-icon-light.ico`
- Desktop app dark theme icon: `assets/logo/app-icon-dark.ico`
- Installer icon: one of the `.ico` files

## App previews

The hero carousel checks these first:

- `assets/app/app-preview-light.png`
- `assets/app/app-preview-dark.png`
- `assets/app/app-preview.png`

Add more screenshots with these names if needed:

- `assets/app/screen-01.png`
- `assets/app/screen-02.png`
- `assets/app/screen-03.png`

## Gallery previews

Mobile-friendly gallery structure:

- `assets/gallery_preview/thumbs/italian/01.jpg`
- `assets/gallery_preview/full/italian/01.jpg`

The website loads `thumbs` first. The large `full` image opens only when the user clicks a card.

## v21 video preview

Homepage app preview is now clickable.

Use this path:

```text
assets/video/demo.mp4
```

No HTML edits are needed. Replace only the video file.

## v21 faster app preview

The site now uses optimized WebP files for the hero preview:

```text
assets/app/app-preview-light.webp
assets/app/app-preview-dark.webp
```

The old PNG files are still included as source/reference files, but WebP is used for faster theme switching.


## v22 notes
- Header/footer logo now switches by site theme.
- Light site theme uses `assets/logo/app-icon-light.png`.
- Dark site theme uses `assets/logo/app-icon-dark.png`.
- The desktop language menu uses SVG flag images because Windows does not render emoji flags in native select elements.
- Mobile feature cards are forced into a 2-column layout under 600px.
