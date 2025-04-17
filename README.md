This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Things to know when developing your own projects:
 - HTTP VS HTTPS - Local host's url starts with http while our API calls to api.nebula start with HTTPS. If you want to learn more about why feel free to chat with the API team https://discord.gg/CKV7N9n2nu

 - Running the project - open a terminal (terminal 1) and run 
```bash 
npm install 
npm run dev
```
open a terminal (terminal 2) and run 
```bash
npm install
npm run start
```
 - bad request error - do you have a .env file with your API key? ex: NEBULA_KEY = abc123
