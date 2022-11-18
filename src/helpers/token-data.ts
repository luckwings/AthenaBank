import axios from 'axios';

export const loadTokenPrices = async (id = "binancecoin") => {
  const url =
    'https://api.coingecko.com/api/v3/coins/'+id+'?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false';

  const data = await axios.get(url);
  return {
    price: data.data.market_data.current_price.usd,
    max_supply: data.data.market_data.max_supply,
    total_supply: data.data.market_data.total_supply,
    circulating_supply: data.data.market_data.circulating_supply,
    market_cap: data.data.market_data.market_cap.usd,
    lastUpdated: Date.now(),
    burned: 0, //coingecko does not return burned
  }
};

export const getTokenData = (id = "binancecoin") => {
  return loadTokenPrices(id);
};
