# Bohol Whale Shark — Website Prototype

Static website ready for GitHub + Cloudflare Pages.

## Deploy
1. Create a GitHub repository (example: `boholwhaleshark`).
2. Upload **the contents of this folder** to the repository root.
3. In Cloudflare Pages, connect the GitHub repository.
4. Framework preset: **None**.
5. Build command: leave blank.
6. Build output directory: `/` (repository root).
7. Add `boholwhaleshark.com` as the custom domain when ready.

## Change prices later
Open `js/config.js`.

Each package currently has:
```js
price: null
```
Change it to a number, for example:
```js
price: 3500
```
The package card and booking summary will automatically show the formatted PHP price.

You can also edit package names, inclusions and pickup locations in the same file.

## Payment later
`booking.html` currently stops at a prototype message. When official pricing is ready, replace the submit behavior in `js/booking.js` with a call to your Cloudflare Worker / PayMongo checkout endpoint.

## Before public launch
Replace placeholder phone/email, confirm all tour rules, operating location, inclusions, prices, cancellation policy, wildlife interaction rules, local government requirements, and photos.
