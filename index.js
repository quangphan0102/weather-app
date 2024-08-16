import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

//SERVER:
const app = express();
const port = 3000;

//USING MIDDLEWARE:
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "beaf37336ee345c90804946da97110e7";

function getUTCTime(dateTime, timeZone) {
    const calcTime = new Date(dateTime * 1000 + (timeZone * 1000));

    let currentHours = calcTime.getUTCHours();

    if (currentHours === 0 || currentHours < 12 ) return "morning";
    else if (currentHours <= 18) return "afternoon";
    else return "night";
}
//Clear, clouds, mist, rain
function weatherType(type) {
    let returnIcon = "";

    switch (type) {
        case "Clear":
            returnIcon = "clear.png";
            break;
        case "Clouds":
            returnIcon = "cloud.png";
            break;
        case "Rain":
            returnIcon = "rain.png";
            break;
        case "Mist":
            returnIcon = "mist.png";
            break;

        default: break;
    }

    return returnIcon;
}

//Get root site:
app.get("/", async (req, res) => {

    try {
        const response = await axios.get(API_URL + "/weather", {
            params: {
                appid:  API_KEY,
                q: "Tokyo",
                units: "metric"
            }
        })

        const result = response.data;

        res.render("index.ejs", {
            timeScale: getUTCTime(result.dt, result.timezone),
            icon: weatherType(result.weather[0].main),
            data: result
        });

    } 
    catch (error) {
        res.render("index.ejs", {
            error: "Cannot find destination."
        });
    }
});

app.post("/find-location", async (req, res) => {

    try {
        const response = await axios.get(API_URL + "/weather", {
            params: {
                q: req.body.cityname,
                appid: API_KEY,
                units: "metric"
            }
        });

        const result = response.data;

        res.render("index.ejs", {
            timeScale: getUTCTime(result.dt, result.timezone),
            icon: weatherType(result.weather[0].main),
            data: result
        });
    }
    catch (error) {
        res.render("index.ejs", {
            error: "Cannot find destination."
        });
    }

    // res.render("index.ejs");
});

//LISTENING LOG BACK:
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})