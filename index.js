const puppeteer = require("puppeteer-core");
const fs = require("fs");

const distanceMatrix = [];

const carXPath = '//*[@id="omnibox-directions"]/div/div[2]/div/div/div/div[2]/button/div[1]';
const busXPath = '//*[@id="omnibox-directions"]/div/div[2]/div/div/div/div[3]/button/div[1]';
const walkXPath = '//*[@id="omnibox-directions"]/div/div[2]/div/div/div/div[4]/button/div[1]';
const bicycleXPath = '//*[@id="omnibox-directions"]/div/div[2]/div/div/div/div[5]/button/div[2]';
const planeXPath = '//*[@id="omnibox-directions"]/div/div[2]/div/div/div/div[6]/button/div[2]';

run();

async function run() {
    const browser = await puppeteer.launch({
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // for Linux compatibility
    });
    const page = await browser.newPage();

    const coordinatesMatrix = await getCoordinates();

    for (let x = 0; x < coordinatesMatrix.length; x++) {
        const row = [];

        for (let y = 0; y < coordinatesMatrix.length; y++) {
            let lat1 = coordinatesMatrix[x][0];
            let lon1 = coordinatesMatrix[x][1];
            let lat2 = coordinatesMatrix[y][0];
            let lon2 = coordinatesMatrix[y][1];

            let url = `https://www.google.com/maps/dir/${lat1},${lon1}/${lat2},${lon2}`;

            await page.goto(url);

            const data = await page.evaluate((carXPath) => {
                const durationElement = document.evaluate(
                    carXPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                return durationElement !== null && durationElement !== undefined && durationElement.innerText.trim() !== ""
                    ? durationElement.innerText.trim().split(" ")[0].trim()
                    : "0";
            }, carXPath);

            row.push(data);
            console.log(`lat1:${lat1} ,lon1:${lon1} / lat2:${lat2} ,lon2:${lon2} --> duration: ${data}`);
        }
        distanceMatrix.push(row);
    }

    console.log(distanceMatrix);
    writeOutput(distanceMatrix);

    await browser.close();
}

function getCoordinates() {
    return new Promise((resolve, reject) => {
        fs.readFile("coordinates.json", "utf8", (err, data) => {
            if (err) {
                console.error("Error reading the file:", err);
                reject(err);
                return;
            }

            try {
                const matrix = JSON.parse(data).map((coordinateString) => coordinateString.split(",").map(Number));
                resolve(matrix);
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                reject(jsonError);
            }
        });
    });
}

function writeOutput(matrix) {
    const jsonData = JSON.stringify(matrix, null, 2);

    fs.writeFile("output.json", jsonData, "utf8", (err) => {
        if (err) {
            console.error("Error writing to output.json:", err);
            return;
        }
        console.log("Matrix successfully written to output.json");
    });
}
