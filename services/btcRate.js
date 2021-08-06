import Coinpaprika from "@coinpaprika/api-nodejs-client";

export default class BtcRateService {
    constructor() {
        this.coinpaprika = new Coinpaprika();
    }
    get btcRate() {
        const tickerPromise = this.coinpaprika.getAllTickers({
            coinId: "btc-bitcoin",
            quotes: ["UAH"],
        });
        return tickerPromise.then(ticker => ticker.quotes.UAH.price);
    }
}
