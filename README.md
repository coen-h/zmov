<div align="center">
<image src="./public/images/logo.png" width="300"/>

### Movie Website Template & Recreation!
</div>

<br/>

## Features
- Browse movies and/or TV shows
- Fast and lightweight frontend
- Clean, modern UI
- Mobile PWA
- Saves Watch History
- Ad-free

## Screenshots

| PC                                                             | Mobile                                                          |
|----------------------------------------------------------------|-----------------------------------------------------------------|
| <img src="./screenshots/home.png" alt="home" width="750"/>     | <img src="./screenshots/mhome.png" alt="home" width="220"/>     |
| <img src="./screenshots/info.png" alt="info" width="750"/>     | <img src="./screenshots/minfo.png" alt="info" width="220"/>     |
| <img src="./screenshots/search.png" alt="search" width="750"/> | <img src="./screenshots/msearch.png" alt="search" width="220"/> |
| <img src="./screenshots/user.png" alt="user" width="750"/>     | <img src="./screenshots/muser.png" alt="user" width="220"/>     |


## 👨🏻‍💻 Run Locally

### :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.

- Clone the project:

  ```sh
  git clone https://github.com/coen-h/zmov
  ```

- Go to the project directory:

  ```sh
  cd zmov
  ```

- Install dependencies:

  ```sh
  npm install
  ```

- Create a `.env` file:

- Request an API key from TMDB and them add it to the `.env` file

  ```ini
  VITE_API_KEY=YOUR_TMDB_API_KEY
  ```

- Create a Supabase Project and setup Authentication with Google. (You can find guides online to help if you don't know how to do this already.)

- Create a new table in your Supabase project with this PostgresQL query:

  ```SQL
  CREATE TABLE public.watchedItem (itemId integer NOT NULL UNIQUE,userId uuid NOT NULL,title text NOT NULL,type text NOT NULL,poster text,progress double precision DEFAULT '0'::double precision,duration double precision DEFAULT '0'::double precision,episode integer DEFAULT 1,season integer DEFAULT 1,numOfEpisodes integer DEFAULT 0,numOfSeasons integer DEFAULT 0,createdAt timestamp with time zone NOT NULL DEFAULT now(),CONSTRAINT watchedItem_pkey PRIMARY KEY (itemId, userId));
  ```

- Add the following environment variables to your .env file (You might need to use the transaction pooler database url if direct connection doesn't work for you)

  ```ini
  NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
  DATABASE_URL=YOUR_SUPABASE_DATABASE_URL
  ```

- Start the server:

  ```sh
  npm run dev
```