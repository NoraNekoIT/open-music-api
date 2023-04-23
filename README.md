
# Install Command

web server
- `npm init --y`

http server
- `npm install @hapi/hapi`

es lint
- `npm install eslint --save-dev`
- `npx eslint --init`

es lint integrate web strom 
- [read this](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_linters_eslint_install)

env
- `npm install dotenv`

bcrypt
- `npm install bcrypt`

jwt 
- `npm install @hapi/jwt`

amplib for producer
- `npm install amqplib`

nodemailer
- `npm install nodemailer`

inert
- `npm install @hapi/inert`

pg
- `npm install pg`

migrate
- `npm install node-pg-migrate`
- `npm run migrate up`

redis
- `npm install redis`

# Migration Command
- `npm run migrate create 'create table albums'`
- `npm run migrate create 'create table songs'` 
- `npm run migrate create 'create table users'` 
- `npm run migrate create 'create table authentications'`
- `npm run migrate create 'create table playlists'`
- `npm run migrate create 'create table playlists_songs'`
- `npm run migrate create 'create table collaborations'`
- `npm run migrate create 'create table playlist_song_activities'`
- `npm run migrate create 'create table user_album_likes'`

# PSQL Command
- `psql --username postgres`

- `CREATE USER masbuncuy WITH ENCRYPTED PASSWORD 'root';`

- `CREATE DATABASE openmusic;`

- `GRANT ALL PRIVILEGES ON DATABASE openmusic TO masbuncuy;`

- `ALTER DATABASE openmusic OWNER TO masbuncuy;`

- `\q`

- `psql --username masbuncuy --dbname openmusic`

- `\c openmusic postgres`

- `GRANT ALL ON SCHEMA public TO openmusic;`

- `TRUNCATE user_album_likes, playlist_songs, collaborations, playlist_song_activities, songs, albums, users, playlists;`

nano id
- `npm install nanoid@3.x.x`

joi
- `npm install joi`

auto bind
- `npm i auto-bind@4`

# Redis Command
- `memurai-cli`
- `flushall`

# Rabbit MQ 
- http://localhost:15672
- `{guest, guest}`
