# Krypton Server
Krypton server.

## Installation
Github:
```
git clone https://github.com/cspi-git/krypton-server
```

NpmJS:
```
npm i randomstring bcryptjs hash.js express moment gun
```

## Q&A
### Hosting
You can host the peers for free using Replit.

### Will the data be safe?
Yes, the accounts are hashed using Bcrypt with salt and the codes are hashed using SHA512.

### How can I host a peer in Replit for free?
After running the gunServer (code), get the URL then just ping it every 5 minutes using [UptimeRobot](https://uptimerobot.com/).

### Can I also host the main server in Replit?
Yes you can BUT be sure to use env variables instead. Check index.js

## Usage
```
node index.js
```

## Note
Please change the **adminKey** in settings.json and add peers for the database.

## License
MIT © CSPI