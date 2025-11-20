# Dynamic Hero Block

Displays the most recent featured article in a hero banner format with automatic fetching from the news feed.

## Usage

In your AEM document, simply create the block:

```
| Dynamic Hero |
```

**Behavior:**
- Always displays **1 article** (the most recent featured article)
- Automatically filters for featured articles only
- Sorted by release date (newest first)
- No configuration needed

## Features

- ✅ Large, eye-catching hero banner
- ✅ Automatic image optimization
- ✅ Text overlay with gradient background for readability
- ✅ Responsive design
- ✅ Call-to-action button

## What Gets Displayed

The block will automatically:
1. Fetch all articles with `feature='true'`
2. Sort them by release date (newest first)
3. Display the most recent one

## Layout

- **Background:** Featured article image
- **Content:** Article title, description, and "Read More" button
- **Styling:** Text overlay with shadow for readability

## Notes

- If no featured articles are found, a message will be displayed
- The hero image is loaded eagerly for best performance (above-the-fold content)
- Images are optimized for different screen sizes and formats (WebP, JPEG)
- No author configuration is needed - it's fully automatic

