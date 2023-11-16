# Google Maps Duration Matrix Generator
  This Node.js script leverages Puppeteer, a headless browser automation library, to calculate travel durations between sets of geographical coordinates using Google Maps. The distances are obtained for various transportation modes (car, bus, walk, bicycle, and plane) and stored in a matrix.

## Features:
Utilizes Puppeteer to automate web interactions with Google Maps.
Reads geographical coordinates from a JSON file and creates a matrix of travel durations.
Supports multiple transportation modes with configurable XPaths for each mode.
Outputs the resulting matrix to an output.json file for further analysis or integration.

## Usage:
Install dependencies: npm install puppeteer-core.
Configure the paths to your Chrome executable and input coordinates in coordinates.json.
Run the script using node index.js.

<br>

> Ensure compliance with Google Maps' terms of service when using this script for web scraping purposes.
Feel free to customize and extend the script based on your specific use case. Contributions and feedback are welcome!
