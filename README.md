# Crypto Portfolio Tracker

This project requires Node.js v20, or higher, and uses MongoDB Cloud to cache API requests. Setup (free)Alchemy api key and mongodb cloud. OR reach out to me. I can provide my key and database url.

## Getting Started

First, install dependencies

```
yarn
```

Second, copy .env.example to env.local and update environmental variables: ALCHEMY_API_KEY, MONGODB_URI, and MONGODB_DB

```
cp .env.example .env.local
```

Lastly, run the development server:

```bash
yarn dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## Optional Steps

Once development server is running, navigate to http://localhost:3000/api/coingecko/populate. This call may need a few minutes. This endpoint fetched all tokens, their ID, and contract address, and caches it in a mongodb collection.
