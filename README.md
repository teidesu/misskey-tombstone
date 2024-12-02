# misskey-tombstone

a simple astro service that hosts historical posts exported from a misskey instance

only supports single-user setups (for now?)

## setup

first set up env vars

```bash
PRIVATE_POSTS_SECRET=some random string, will be used to hide followers-only posts
USERNAME=teidesu # username of the user
AVATAR=https://link/to/avatar.jpg
HOSTNAME=very.stupid.fish # domain name of the instance
TOKEN=misskey token for extend-dump.ts
```

then copy misskey export to `data/notes-orig.json` and run:
```bash
tsx src/scripts/extend-dump.ts
tsx src/scripts/download-files.ts
tsx src/scripts/encrypt-data.ts
```

then build like a normal static astro project and deploy to your server :3
