import lodash from 'lodash';
import * as market_constants from '@app/app.market.constants';

export interface Currency {
  code?: string;
  name?: string;
  symbol?: string;
}

export const CURRENCIES_LIST: Currency[] = [
  {
    code: "btc",
    name: "Bitcoin",
    symbol: "Ƀ",
  },
  {
    code: "usd",
    name: "Dollar",
    symbol: "$",
  },
  {
    code: "eur",
    name: "Euro",
    symbol: "€",
  },
  {
    code: "gbp",
    name: "British Pound",
    symbol: "£",
  },
  {
    code: "krw",
    name: "South Korean Won",
    symbol: "₩",
  },
  {
    code: "cny",
    name: "Chinese Yuan",
    symbol: "CN¥",
  },
  {
    code: "jpy",
    name: "Japanese Yen",
    symbol: "¥",
  },
  {
    code: "aud",
    name: "Australian Dollar",
    symbol: "A$",
  },
  {
    code: "cad",
    name: "Canadian Dollar",
    symbol: "CA$",
  },
  {
    code: "rub",
    name: "Russian Ruble",
    symbol: "RUB",
  },
  {
    code: "inr",
    name: "Indian Rupee",
    symbol: "₹",
  },
  {
    code: "brl",
    name: "Brazilian Real",
    symbol: "R$",
  },
  {
    code: "chf",
    name: "Swiss Franc",
    symbol: "CHF",
  },
  {
    code: "hkd",
    name: "Hong Kong Dollar",
    symbol: "HK$",
  },
  {
    code: "idr",
    name: "Indonesian Rupiah",
    symbol: "IDR",
  },
  {
    code: "mxn",
    name: "Mexican Peso",
    symbol: "MX$",
  },
];

export class MarketCurrency implements Currency {
  code: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  date: Date;
  timestamp: number;
  change24h: number;

  fromCurrency(currency: Currency) {
    this.code = currency.code;
    this.name = currency.name;
    this.symbol = currency.symbol;
  }
}

export class MarketInfo {
  category: string;
  identifier: string;
  name: string;
  position: number;
  symbol: string;
}

export class MarketTicker {
  info: MarketInfo;
  market: MarketCurrency[];

  constructor(data?: any) {
    if (!data) return;

    let self: any = this;

    for (let prop in data) {
      self[prop] = data[prop];
    }

    return self;
  }

  getCurrency(query: any): MarketCurrency {
    return lodash.find(this.market, query);
  }

  deserialize(input: any): MarketTicker {
    let self: any = this;
    if (!input || !lodash.isObject(input)) return;

    self.info = {
      identifier: input.symbol,
      name: input.symbol,
      symbol: input.symbol,
    }

    let currencies: MarketCurrency[] = [];

    for (let currency of CURRENCIES_LIST) {
      let currencyCode = currency.code.toUpperCase();
      let marketCurrency: MarketCurrency = new MarketCurrency();
      marketCurrency.fromCurrency(currency);

      marketCurrency.price = 0.0;
      marketCurrency.marketCap = 0.0;
      marketCurrency.volume = 0.0;
      marketCurrency.timestamp = 0;
      marketCurrency.date = null;
      marketCurrency.change24h = 0;

      if (input['currencies'] && input.currencies[currencyCode]) {
        marketCurrency.price = input.currencies[currencyCode].PRICE;
        marketCurrency.marketCap = input.currencies[currencyCode].MKTCAP;
        marketCurrency.volume = input.currencies[currencyCode].SUPPLY;
        marketCurrency.timestamp = input.currencies[currencyCode].time;
        marketCurrency.date = new Date(marketCurrency.timestamp * 1000);
        marketCurrency.change24h = input.currencies[currencyCode].CHANGEPCT24HOUR || null;
      }

      currencies.push(marketCurrency);
    }

    self.market = currencies;

    return self;
  }
}

export class MarketHistory {
  history: any;

  deserialize(input: any): MarketHistory {
    let self: any = this;
    if (!input || !lodash.isObject(input)) return;

    let history = {};

    for (let currency in input) {
      for (let data of input[currency]) {
        let date = (new Date(data.time * 1000)).setHours(0, 0, 0, 0);
        if (!history[currency]) {
          history[currency] = {};
        }
        history[currency][date] = data.close;
      }
    }

    self.history = history;

    return self;
  }

  getPriceByDate(currencyCode: string, date: Date): number {
    let timestampDate = date.setHours(0, 0, 0, 0);
    return this.history[currencyCode.toUpperCase()][timestampDate];
  }

  getLastWeekPrice(currencyCode: string): any {
    let dates = lodash(this.history[currencyCode]).keys().takeRight(7).value().map((date) => { return new Date(parseInt(date)) });
    let prices = lodash(this.history[currencyCode]).values().takeRight(7).value();

    return { dates, prices };
  }
}
