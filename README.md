# changelog.community

[Changelog.community](https://www.changelog.community/) is your AI generated changelog.

Link your public github repository and generate changelog entries with AI ⚡️

[Show HN](https://news.ycombinator.com/item?id=43326615)

## Product Decisions

I wanted to make a site that could grow into a community of people that ship. Currently, the site gives users the power to pull in commits for a given date range, select which ones to generate an entry for and then generate changelog entries with AI from the GitHub changes made in the commit.

Changelog entries get posted to a user's public changelog site where they can share their product updates with the world.

## Longer term

- **Newsfeed:** Longer term there could be a newsfeed of all the changelog entries that people are shipping or there could be a way to subscribe to changelogs and see those entries in your feed.
- **GitHub OAuth:** We're not handling private tokens right now. Supporting private repositories and higher rate limits through GitHub OAuth would be a logical step forward, especially given we have Clerk to help with that.
- **Entry management:** Right now you can regenerate entries but once they are posted you are stuck with them forever. Users will need to edit and delete their entries.
- **Entry improvements:** Each entry could have their own custom URL slug and image. Their could also be some author or authors shown for the entry.
- ... and many more

## Technical Decisions

- **Clerk for authentication:** This seems to be the de facto standard for auth. It was my first time using it and I like it :)
- **Subdomains:** each user when they sign up will get a subdomain where their changelog will be hosted. I wanted a public site where people can host their changelogs that made sense and people can share that is entirely their own. Perhaps in the future we could offer CNAME records as part of a premium plan ✨ for people that want their changelog on their own domain.
- **Commit Tailwind UI template:** I used the Tailwind UI "Changelog" starter template because it felt fitting for a changelog site.
- **AI development**: I primarily used Claude and Perplexity for building out the application.
- **OpenAI**: OpenAI is the LLM I'm using.
- **Postgres Neon**: I created the Postgres database through the Vercel UI. I wanted a database to store users, projects and entries to various commit logs. The database is set up in such a way that multiple users can belong to projects, rather than only one user being able to post entries to a changelog.
- **Prisma ORM:** Not as nice as [Eloquent](https://laravel.com/docs/11.x/eloquent) but that's okay 🤪
- **Vercel:** hosting and Vercel DNS servers. I bought the domain on Porkbun but then pointed nameservers to Vercel for the subdomain matching.
- **Ant Design:** I've had my eye on this design framework for a while primarily because their multi select input looks cool. It serves it\'s purpose but I did not get super into the weeds here. Overall I like it though shadcn/ui seems to be an industry favorite and what I\'m using on my other side project.
- **No queued jobs:** sometime fetching the commits from the GitHub API and feeding it to an LLM can take a bit long. Right now we're doing it all in the request lifecycle but could use queued jobs and websockets to provide a snappier user experience.

## Accessing the application

Changelog community is deployed live at [https://changelog.community](https://www.changelog.community/).

## Running locally

To run locally you will need to fill in the values in `.env.example` in your own `.env` file. Notably you'll need need Open API key, Clerk API key and a Postgres database. The Postgres database I'm using is on Neon via Vercel.

## Starter template info..

### Adding changelog entries to homepage

> This will probably turn into landing page and marketing content

All of the changelog entries are stored in one big `./src/app/page.mdx` file. We were inspired to set it up this way by how projects commonly maintain plaintext `CHANGELOG` files, and thought it would be cool to parse this sort of format and turn it into a nicely designed site.

Each changelog entry should be separated by a horizontal rule (`---`) and should include an `<h2>` with a date, specified as an [MDX annotation](https://github.com/bradlc/mdx-annotations):

```md
---

![](@/images/your-screenshot.png)

## My new changelog entry {{ date: '2023-04-06T00:00Z' }}

Your content...
```

### RSS feed

The site uses a [route handler](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) to automatically generate an RSS feed at run time based on the rendered home page.

You can edit the metadata for the feed (like the title and description) in `./src/app/feed.xml/route.ts`.

Make sure to set your `NEXT_PUBLIC_SITE_URL` environment variable as the RSS feed needs this to generate the correct links for each entry.
