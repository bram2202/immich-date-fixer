# Immich-date-fixer

When importing Photos into Immich something happened and a lot of my photos where imported on the same date.
The photos have the correct datetime in there name.

This script tries to read the datetime from the filename and set it the that datetime.

## How to use

1. Create API key in Immich by logging in as the correct user an create on via the settings menu.
2. Copy the `.env.example to .env` and put this key in this file.
3. Update the URL to connect to you instance.
4. Create a new album and put all incorrect photos into that album
5. Update the .env file with the ID of the new album
6. Run the program `npm run start`
7. wait unit its says `DONE`

The process is synchronous instead of asynchronous, this will take a bit more time.<br/>
But allows for easier debugging when hitting a filename thats not handled correctly of settings are incorrect