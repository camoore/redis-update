require("dotenv").config();

const cors = require("cors"),
  express = require("express"),
  morgan = require("morgan"),
  redis = require("redis"),
  cron = require("node-cron"),
  PORT = process.env.PORT,
  API_KEY = process.env.API_KEY,
  { getOdds } = require("./api.js");

client = redis.createClient(process.env.REDIS_URL);
app = express();
app.use(cors());
app.use(morgan("combined"));

const updateRedis = () => {
  const SPORT_KEYS = ["americanfootball_nfl", "americanfootball_ncaaf"];
  const MKTS = ["h2h", "spreads", "totals"];

  SPORT_KEYS.forEach(sport => {
    MKTS.forEach(async mkt => {
      try {
        let odds = await getOdds(API_KEY, sport, mkt);
        if (odds) {
          client.set(`${sport}_${mkt}`, odds);
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};

cron.schedule(
  "0 0 */12 * * *",
  async () => {
    await updateRedis();
    console.log(`${new Date()} - Redis API updated`);
  },
  {
    scheduled: true,
    timezone: "America/Chicago"
  }
);

app.get("/", async (req, res, next) => {
  return res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n${new Date()} - App Started on Port: ${PORT}`);
});
