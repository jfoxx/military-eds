# Dynamic Carousel Block

Displays news articles in a carousel format with automatic fetching from the news feed.

## Usage

In your AEM document, create a block with configuration options:

### Basic Example (Uses Defaults)

```
| Dynamic Carousel |
```

**Default behavior:**
- Displays **5 articles**
- Sorted by release date (newest first)
- Shows all articles (not filtered)

### Custom Configuration

```
| Dynamic Carousel      |
| limit      | 3        |
| featured   | true     |
```

```
| Dynamic Carousel      |
| limit      | 10       |
| category   | updates  |
```

```
| Dynamic Carousel      |
| limit      | 8        |
| tag        | military |
```

## Configuration Options

| Option     | Type    | Default | Description                                    |
|------------|---------|---------|------------------------------------------------|
| `limit`    | number  | 5       | Number of articles to display                  |
| `featured` | boolean | false   | Show only featured articles (`true`/`false`)   |
| `category` | string  | -       | Filter by specific category                    |
| `tag`      | string  | -       | Filter by specific tag                         |

## Features

- ✅ Automatic image optimization
- ✅ Navigation buttons (Previous/Next)
- ✅ Slide indicators
- ✅ Responsive layout
- ✅ Touch/swipe support
- ✅ Accessibility features (ARIA labels, keyboard navigation)

## Notes

- Articles are automatically sorted by release date (newest first)
- If no articles match the criteria, a message will be displayed
- Images are optimized for different screen sizes and formats (WebP, JPEG)
- **Automatic Deduplication:** If a Dynamic Hero block appears on the same page, the carousel will automatically exclude the hero's article to prevent duplicates. This also works between multiple dynamic blocks on the same page.

