# DVIDS News Block

Displays news articles from DVIDS (Defense Visual Information Distribution Service) with on-site links that keep users within your EDS website.

## How It Works

1. **Listing**: The `dvids-news` block fetches articles from the DVIDS Search API
2. **On-Site Links**: Article cards link to `/dvids/article?id={dvids_id}` (stays on your site)
3. **On-Demand Fetch**: The `dvids-article` block fetches full article content when visited

## Usage

### Basic DVIDS News Listing

```
| DVIDS News |
```

### With Configuration Options

```
| DVIDS News        |
| limit    | 6      |
| branch   | Army   |
| keyword  | training |
```

## Configuration Options

| Option    | Description                          | Default  | Example Values                                  |
|-----------|--------------------------------------|----------|------------------------------------------------|
| `limit`   | Number of articles to display        | 6        | 3, 6, 12                                       |
| `branch`  | Filter by military branch            | (all)    | Army, Navy, Air Force, Marines, Coast Guard   |
| `unit`    | Filter by DVIDS unit ID              | (all)    | 12345                                          |
| `keyword` | Search keyword                       | (none)   | training, exercise, deployment                 |
| `sort`    | Sort field                           | date     | date, publishdate, timestamp, score           |
| `sortdir` | Sort direction                       | desc     | asc, desc                                      |

## Article Detail Page Setup

To enable on-site article viewing, create a page in SharePoint:

1. Create a folder: `/dvids/`
2. Create a document: `article.docx`
3. Add a DVIDS Article block:

```
| DVIDS Article |
```

That's it! When users click "Read More" on any DVIDS article card, they'll be taken to `/dvids/article?id=123456` where the full article is fetched and displayed.

## Example Configurations

### Army News Feed
```
| DVIDS News        |
| limit    | 8      |
| branch   | Army   |
```

### Navy Training Articles
```
| DVIDS News          |
| limit    | 6        |
| branch   | Navy     |
| keyword  | training |
```

### Latest Across All Branches
```
| DVIDS News        |
| limit    | 12     |
| sort     | date   |
| sortdir  | desc   |
```

## Notes

- Articles are fetched client-side from the DVIDS API
- Images use DVIDS thumbnail URLs for performance
- The API key is currently embedded; consider proxying for production
- DVIDS attribution is automatically included

