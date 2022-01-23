# Yoda sightings

To build and deploy create a shell script called `deploy` to copy `dist` to the webserver and then run `deno run --allow-read --allow-write --allow-run ./generate.ts` which will build the project and call the `deploy` script

The image files must be in the `sightings` folder