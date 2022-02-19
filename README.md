# Notion URL Shortener

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> Uses Notion database as personal URL shortener.

## Demo

- [Public](https://notion-url-shortener.vercel.app/)

## Getting Started

### Prep work

1. [Create a Notion account](https://www.notion.so/signup)
2. [Duplicate this Notion database template](https://younho9.notion.site/0382396e66cd4575901bd3ba0959fdb9?v=8dc11ef9545f494bbc4bb2380b926d0e)
3. [Create a Notion API integration & Get Token](https://developers.notion.com/docs#step-1-create-an-integration)
4. [Share a database with your integration](https://developers.notion.com/docs#step-2-share-a-database-with-your-integration)
5. [Deploy on Vercel](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyounho9%2Fnotion-url-shortener%2Ftree%2Fmain&env=NEXT_PUBLIC_NOTION_DATABASE_URL,NOTION_API_TOKEN&envDescription=Notion%20Database%20%26%20Notion%20API%20token%20is%20required.&envLink=https%3A%2F%2Fgithub.com%2Fyounho9%2Fnotion-url-shortener%23environment-variables&project-name=notion-url-shortener&repo-name=notion-url-shortener&demo-title=Notion%20URL%20Shortener&demo-description=Notion%20URL%20Shortener%20(Public)&demo-url=https%3A%2F%2Fnotion-url-shortener.vercel.app%2F>)
6. Set `NEXT_PUBLIC_NOTION_DATABASE_URL` to your database URL, `NOTION_API_TOKEN` to your token obtained in step 3.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyounho9%2Fnotion-url-shortener%2Ftree%2Fmain&env=NEXT_PUBLIC_NOTION_DATABASE_URL,NOTION_API_TOKEN&envDescription=Notion%20Database%20%26%20Notion%20API%20token%20is%20required.&envLink=https%3A%2F%2Fgithub.com%2Fyounho9%2Fnotion-url-shortener%23environment-variables&project-name=notion-url-shortener&repo-name=notion-url-shortener&demo-title=Notion%20URL%20Shortener&demo-description=Notion%20URL%20Shortener%20(Public)&demo-url=https%3A%2F%2Fnotion-url-shortener.vercel.app%2F>)

## Environment Variables

### `NEXT_PUBLIC_NOTION_DATABASE_URL`

**Required** Notion database page URL.

```
https://www.notion.so/<your-workspace>/a8aec43384f447ed84390e8e42c2e089
# or
https://<your-workspace>.notion.site/a8aec43384f447ed84390e8e42c2e089
```

### `NOTION_API_TOKEN`

**Required** Notion API Key.

> [How to get Notion API Key](https://developers.notion.com/docs)

<details>
  <summary>Show advanced options</summary>

### `USE_TOKEN_AUTH`

If set to `true`, visitors without tokens cannot submit new URLs.

_Default_ `false`

### `MAXIMUM_ZERO_WIDTH_SHORTEN_LENGTH`

Maximum length of URL path with zero width shorten.

_Default_ `8`

### `MAXIMUM_BASE64_SHORTEN_LENGTH`

Maximum length of URL path with base64 shorten.

_Default_ `7`

### `MAXIMUM_GENERATION_ATTEMPTS`

Maximum number of times to retry when the generated URL path conflicts with the already registered URL path.

_Default_ `5`

</details>

## License

[MIT](LICENSE)
