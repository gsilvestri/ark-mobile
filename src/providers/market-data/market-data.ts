import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import { StorageProvider } from '@providers/storage/storage';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';

import * as model from '@models/market';
import { UserSettings } from '@models/settings';
import * as constants from '@app/app.constants';
import * as market_constants from '@app/app.market.constants';

@Injectable()
export class MarketDataProvider {

  public onUpdateTicker$: Subject<model.MarketTicker> = new Subject<model.MarketTicker>();

  private settings: UserSettings;
  private marketTicker: model.MarketTicker;
  private marketHistory: model.MarketHistory;

  constructor(
    private http: HttpClient,
    private storageProvider: StorageProvider,
    private settingsDataProvider: SettingsDataProvider,
  ) {
    this.loadData();
    this.fetchTicker();

    settingsDataProvider.settings.subscribe((settings) => {
      this.settings = settings;
      this.fetchHistory();
    });

    this.onUpdateSettings();
  }

  get history(): Observable<model.MarketHistory> {

    if (this.marketHistory) return Observable.of(this.marketHistory);

    return this.fetchHistory();
  }

  get ticker(): Observable<model.MarketTicker> {
    if (this.marketTicker) return Observable.of(this.marketTicker);

    return this.fetchTicker();
  }

  refreshPrice(): void {
    this.fetchTicker().subscribe((ticker) => {
      this.onUpdateTicker$.next(ticker);
    });
  }

  private fetchTicker(): Observable<model.MarketTicker> {

    if(market_constants.API_MARKET_HARDCODED_DATAS===true){
      return this.kapuFetchTicker();
    }

    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_TICKER_ENDPOINT}`;

    let currenciesList = model.CURRENCIES_LIST.map((currency) => {
      return currency.code.toUpperCase();
    }).join(',');

    return this.http.get(url + currenciesList).map((response) => {
      let json = response['RAW']['KAPU'];
      let tickerObject = {
        symbol: json['BTC']['FROMSYMBOL'],
        currencies: json,
      };

      this.marketTicker = new model.MarketTicker().deserialize(tickerObject);
      this.storageProvider.set(constants.STORAGE_MARKET_TICKER, tickerObject);

      return this.marketTicker;
    });
  }

  private kapuFetchTicker(): Observable<model.MarketTicker> {

    //let ticker = Observable.of(new model.MarketTicker().deserialize( market_constants.API_MARKET_HARDCODED_TICKER ));
    //return ticker;
    /*let json = market_constants.API_MARKET_HARDCODED_TICKER['RAW']['KAPU'];
    let tickerObject = {
      symbol: json['BTC']['FROMSYMBOL'],
      currencies: json,
    };

    this.marketTicker = new model.MarketTicker().deserialize(tickerObject);
    this.storageProvider.set(constants.STORAGE_MARKET_TICKER, tickerObject);

    return  Observable.of(this.marketTicker);*/

    const url = `${constants.API_MARKET_URL}/${market_constants.BTC_API_MARKET_TICKER_ENDPOINT}`;

    let currenciesList = model.CURRENCIES_LIST.map((currency) => {
      return currency.code.toUpperCase();
    }).join(',');

    return this.http.get(url + currenciesList).map((response) => {
      let json = Object.assign({}, response['RAW']['BTC']);

      json['BTC'] = Object.assign({}, market_constants.API_MARKET_HARDCODED_TICKER['RAW']['KAPU']['BTC']); // Sovrascrivo la definizione e i tassi di cambio di BTC

      let tickerObject = {
        symbol: json['BTC']['FROMSYMBOL'],
        currencies: json,
      };

      model.CURRENCIES_LIST.map((currency) => {
        try {

          let cc = currency.code.toUpperCase();
          console.log('currency: '+cc);
          if(cc!=='BTC') {
            json[cc]["FROMSYMBOL"]="KAPU";
            json[cc]["TOSYMBOL"]="BTC";
            json[cc]["FLAGS"]="4";
            json[cc]["PRICE"]=(cc=='BTC') ? 0.00002500 : json[cc]["PRICE"] * 0.00002500;
            json[cc]["LASTUPDATE"]=(cc=='BTC') ? 0.00002500 : json[cc]["LASTUPDATE"] * 1516443334;
            json[cc]["LASTVOLUME"]=0;
            json[cc]["LASTVOLUMETO"]=0;
            json[cc]["LASTTRADEID"]="0";
            json[cc]["VOLUMEDAY"]=0;
            json[cc]["VOLUME24HOUR"]=0;
            json[cc]["VOLUMEDAYTO"]=0;
            json[cc]["VOLUME24HOURTO"]=0;
            json[cc]["OPENDAY"]=(cc=='BTC') ? 0.00002500 : json[cc]["OPENDAY"] * 0.00002500;
            json[cc]["HIGHDAY"]=(cc=='BTC') ? 0.00002500 : json[cc]["HIGHDAY"] * 0.00002500;
            json[cc]["LOWDAY"]=(cc=='BTC') ? 0.00002500 : json[cc]["LOWDAY"] * 0.00002500;
            json[cc]["OPEN24HOUR"]=(cc=='BTC') ? 0.00002500 : json[cc]["OPEN24HOUR"] * 0.00002500;
            json[cc]["HIGH24HOUR"]=(cc=='BTC') ? 0.00002500 : json[cc]["HIGH24HOUR"] * 0.00002500;
            json[cc]["LOW24HOUR"]=(cc=='BTC') ? 0.00002500 : json[cc]["LOW24HOUR"] * 0.00002500;
            json[cc]["LASTMKAPUET"]="NoNameMarket";
            json[cc]["CHANGE24HOUR"]=0;
            json[cc]["CHANGEPCT24HOUR"]=0;
            json[cc]["CHANGEDAY"]=0;
            json[cc]["CHANGEPCTDAY"]=0;
            json[cc]["SUPPLY"]=2937;
            json[cc]["MKTCAP"]=json[cc]["MKTCAP"] * 0.00002500;
            json[cc]["TOTALVOLUME24H"]=0;
            json[cc]["TOTALVOLUME24HTO"]=0;
          }
        }catch(err){
          console.log(err);
        }
      });

      this.marketTicker = new model.MarketTicker().deserialize(tickerObject);
      this.storageProvider.set(constants.STORAGE_MARKET_TICKER, tickerObject);

      return this.marketTicker;
    });
  }

  fetchHistory(): Observable<model.MarketHistory> {

    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;
    const myCurrencyCode = (this.settings.currency == 'btc' ? this.settingsDataProvider.getDefaults().currency : this.settings.currency).toUpperCase();

    if(market_constants.API_MARKET_HARDCODED_DATAS===true){
      return this.kapuFetchHistory();
    }

    return this.http.get(url + 'BTC')
      .map((btcResponse) => btcResponse)
      .flatMap((btcResponse) => this.http.get(url + myCurrencyCode).map((currencyResponse) => {
        let historyData = {
          BTC: btcResponse['Data'],
        };
        historyData[myCurrencyCode] = currencyResponse['Data'];
        let history = new model.MarketHistory().deserialize(historyData);

        this.marketHistory = history;
        this.storageProvider.set(constants.STORAGE_MARKET_HISTORY, historyData);

        return history;
      }));
  }

  kapuFetchHistory(): Observable<model.MarketHistory> {
    const url = `${constants.API_MARKET_URL}/${market_constants.BTC_API_MARKET_HISTORY_ENDPOINT}`;
    const myCurrencyCode = (this.settings.currency == 'btc' ? this.settingsDataProvider.getDefaults().currency : this.settings.currency).toUpperCase();

    return this.http.get(url + myCurrencyCode).map((currencyResponse) => {
        let historyData = {
          BTC: market_constants.API_MARKET_HARDCODED_HISTORY_BTC['Data'],
        };

        historyData[myCurrencyCode] = currencyResponse['Data'];
        for(var i=0;i<historyData[myCurrencyCode].length;i++){
          // {"time":1490140800,"high":0.26,"low":0.26,"open":0.26,"volumefrom":0,"volumeto":0,"close":0.26}
          historyData[myCurrencyCode][i]['high']=historyData[myCurrencyCode][i]['high'] / 0.000025;
          historyData[myCurrencyCode][i]['low']=historyData[myCurrencyCode][i]['low'] / 0.000025;
          historyData[myCurrencyCode][i]['open']=historyData[myCurrencyCode][i]['open'] / 0.000025;
          historyData[myCurrencyCode][i]['close']=historyData[myCurrencyCode][i]['close'] / 0.000025;
          historyData[myCurrencyCode][i]['volumefrom']=0;
          historyData[myCurrencyCode][i]['volumeto']=0;
        }
        let history = new model.MarketHistory().deserialize(historyData);

        this.marketHistory = history;
        this.storageProvider.set(constants.STORAGE_MARKET_HISTORY, historyData);

        return history;
      });

  }

  private onUpdateSettings() {
    this.settingsDataProvider.onUpdate$.subscribe((settings) => {
      this.settings = settings;
      this.marketHistory = null;
    })
  }

  private loadData() {
    this.storageProvider.getObject(constants.STORAGE_MARKET_HISTORY).subscribe((history) => {
      if (history) {
        this.marketHistory = new model.MarketHistory().deserialize(history);
      }
    });
    this.storageProvider.getObject(constants.STORAGE_MARKET_TICKER).subscribe((ticker) => {
      if (ticker) {
        this.marketTicker = new model.MarketTicker().deserialize(ticker);
      }
    });
  }

}
