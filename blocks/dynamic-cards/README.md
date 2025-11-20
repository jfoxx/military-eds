# Dynamic Cards Block

Displays news articles in a responsive card grid with automatic fetching from the news feed.

## Usage

In your AEM document, create a block with configuration options:

### Basic Example (Uses Defaults)

```
| Dynamic Cards |
```

**Default behavior:**
- Displays **6 articles**
- Sorted by release date (newest first)
- Shows all articles (not filtered)

### Custom Configuration

```
| Dynamic Cards         |
| limit      | 9        |
| featured   | true     |
```

```
| Dynamic Cards         |
| limit      | 12       |
| category   | news     |
```

```
| Dynamic Cards         |
| limit      | 8        |
| tag        | navy     |
```

## Configuration Options

| Option     | Type    | Default | Description                                    |
|------------|---------|---------|------------------------------------------------|
| `limit`    | number  | 6       | Number of articles to display                  |
| `featured` | boolean | false   | Show only featured articles (`true`/`false`)   |
| `category` | string  | -       | Filter by specific category                    |
| `tag`      | string  | -       | Filter by specific tag                         |

## Features

- ✅ Responsive grid layout (auto-adjusts columns based on screen size)
- ✅ Automatic image optimization
- ✅ Hover effects on cards
- ✅ Clean, modern design
- ✅ Mobile-friendly

## Layout

- **Mobile:** 1 column
- **Tablet:** 2-3 columns (depends on screen width)
- **Desktop:** 3-4 columns (depends on screen width and card count)

The grid automatically adjusts to fit the content and screen size using CSS Grid with `auto-fill`.

## Notes

- Articles are automatically sorted by release date (newest first)
- If no articles match the criteria, a message will be displayed
- Images are optimized for different screen sizes and formats (WebP, JPEG)
- All cards have consistent heights for a clean grid appearance
- **Automatic Deduplication:** If a Dynamic Hero block appears on the same page, the cards will automatically exclude the hero's article to prevent duplicates. This also works between multiple dynamic blocks on the same page.

