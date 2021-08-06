import BtcRateService from "../services/btcRate.js";

const btcRateService = new BtcRateService();

export default async function(request, response) {
    const data = {
        user: request.user,
        rate: await btcRateService.btcRate,
    };
    response.json(data);
}
