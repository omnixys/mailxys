This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Production configuration

Omnimail is deployed only on Vercel with the custom domain
`webmail.omnixys.com`. Configure these server-only values in Vercel Project
Settings for the **Production** environment only:

```text
BACKEND_SERVER_URL=https://api.omnixys.com/graphql
STALWART_JMAP_URL=https://api.omnixys.com/mail/jmap
MAIL_TOKEN_URL=https://api.omnixys.com/v1/mail/token
OMNIMAIL_SERVICE_TOKEN=<value from the approved production secret workflow>
```

Do not expose `OMNIMAIL_SERVICE_TOKEN` through a `NEXT_PUBLIC_` variable and do
not add it to Preview deployments. Kubernetes ExternalSecrets do not configure
Vercel environments.
