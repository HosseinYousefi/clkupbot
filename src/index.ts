require("./bot");
import express from "express";

const app = express();

app.get('/start', (req, res) => {
    const code = req.query.code;
    res.redirect(`https://telegram.me/${process.env.TELEGRAM_BOT_NAME}?start=${code}`);
});

app.listen(process.env.PORT, () => {
    console.log('Started listening...');
});