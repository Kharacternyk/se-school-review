import Coinpaprika from "@coinpaprika/api-nodejs-client";

const coinpaprika = new Coinpaprika();

export default async function(request, response) {
    const rate = (await coinpaprika.getAllTickers({
        coinId: "btc-bitcoin",
        quotes: ["UAH"],
    })).quotes.UAH.price;
    const data = {
        user: request.user,
        rate: rate,
    };
    response.json(data);
}
