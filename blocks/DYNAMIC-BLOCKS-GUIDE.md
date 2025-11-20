# Dynamic News Blocks - Author Guide

This guide shows you how to use the dynamic blocks to automatically display news articles on your pages.

## 🎯 Quick Overview

| Block              | Default Articles | Purpose                           | Configuration Required |
|--------------------|------------------|-----------------------------------|------------------------|
| Dynamic Hero       | 1 (fixed)        | Hero banner with latest featured  | ❌ No (auto)           |
| Dynamic Carousel   | 5 (adjustable)   | Rotating carousel of articles     | ✅ Yes (recommended)   |
| Dynamic Cards      | 6 (adjustable)   | Grid of article cards             | ✅ Yes (recommended)   |

---

## Dynamic Hero

**Always shows 1 featured article** - No configuration needed!

### How to Use:
```
| Dynamic Hero |
```

That's it! It will automatically show your most recent featured article.

---

## Dynamic Carousel

**Shows multiple articles in a carousel** - You control how many!

### Examples:

**Show 3 featured articles:**
```
| Dynamic Carousel      |
| limit      | 3        |
| featured   | true     |
```

**Show 10 recent articles:**
```
| Dynamic Carousel      |
| limit      | 10       |
```

**Show 5 articles from "updates" category:**
```
| Dynamic Carousel      |
| limit      | 5        |
| category   | updates  |
```

**Show 8 articles with "navy" tag:**
```
| Dynamic Carousel      |
| limit      | 8        |
| tag        | navy     |
```

---

## Dynamic Cards

**Shows articles in a responsive grid** - Perfect for news sections!

### Examples:

**Show 9 featured articles in a grid:**
```
| Dynamic Cards         |
| limit      | 9        |
| featured   | true     |
```

**Show 12 recent articles:**
```
| Dynamic Cards         |
| limit      | 12       |
```

**Show 6 articles from "news" category:**
```
| Dynamic Cards         |
| limit      | 6        |
| category   | news     |
```

**Show all recent articles (no limit):**
```
| Dynamic Cards         |
| limit      | 999      |
```

---

## 📋 Configuration Options Reference

### `limit` (number)
- **Dynamic Carousel:** Default is `5`
- **Dynamic Cards:** Default is `6`
- **Dynamic Hero:** Always `1` (cannot be changed)

**How many articles to display**

```
| limit | 10 |
```

### `featured` (true/false)
- Default: `false` (shows all articles)

**Only show featured articles**

```
| featured | true |
```

### `category` (text)
- Default: none (shows all categories)

**Filter by specific category**

```
| category | updates |
```

### `tag` (text)
- Default: none (shows all tags)

**Filter by specific tag**

```
| tag | army |
```

---

## 💡 Common Use Cases

### Homepage Hero + Featured Cards (No Duplicates!)
```
| Dynamic Hero |

---

| Dynamic Cards         |
| limit      | 6        |
| featured   | true     |
```

**Result:** The hero shows the most recent featured article. The cards below automatically exclude that article and show the next 6 featured articles. No duplicates!

### Category Page with Filtered Content
```
| Dynamic Cards         |
| limit      | 12       |
| category   | updates  |
```

### Latest News Carousel
```
| Dynamic Carousel      |
| limit      | 8        |
```

### Featured Articles Carousel
```
| Dynamic Carousel      |
| limit      | 5        |
| featured   | true     |
```

---

## 🎨 Visual Layout

### Dynamic Hero
```
┌─────────────────────────────────────────┐
│                                         │
│  FULL-WIDTH HERO IMAGE                  │
│                                         │
│  [Article Title]                        │
│  [Description]                          │
│  [Read More Button]                     │
│                                         │
└─────────────────────────────────────────┘
```

### Dynamic Carousel
```
← [Article 1 ────────────] →
  [Image    ] [Content   ]
              [Read More ]
  
  ○ ● ○ ○ ○ (indicators)
```

### Dynamic Cards
```
┌────────┐ ┌────────┐ ┌────────┐
│ Image  │ │ Image  │ │ Image  │
│────────│ │────────│ │────────│
│ Title  │ │ Title  │ │ Title  │
│ Desc   │ │ Desc   │ │ Desc   │
│ [Read] │ │ [Read] │ │ [Read] │
└────────┘ └────────┘ └────────┘
```

---

## ⚠️ Important Notes

1. **Articles must exist in `/news/query-index.json`** for these blocks to work
2. All articles are automatically **sorted by release date** (newest first)
3. If no articles match your filters, you'll see: "No articles available"
4. Images are automatically optimized for performance
5. All blocks are fully responsive and mobile-friendly
6. **No Duplicates!** Articles are automatically deduplicated across multiple dynamic blocks on the same page. If you have a Dynamic Hero showing an article, that article won't appear again in Dynamic Cards or Dynamic Carousel on the same page.

---

## 🤔 Need Help?

- **No articles showing?** Check your filters (featured, category, tag)
- **Want more articles?** Increase the `limit` value
- **Want fewer articles?** Decrease the `limit` value
- **Wrong articles?** Check your `category` or `tag` filters

