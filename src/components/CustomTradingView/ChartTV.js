import axios from 'axios';
import { CustomTradingViewUrls } from 'libs/request';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import chartTV_constants from './chartTV_constants';
import Datafeeds from './datafeeds';

// import FormData from "form-data";

// import { updateSelectedSymbolSuccess } from 'reducers/selectedSymbol';

class ChartTV extends React.Component {
  constructor(props) {
    super(props);
    this.id = uuidv4();
    this.state = {
      symbol: props.symbol || 'FPT',
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (!nextProps.symbol) return;
    if (
      nextProps.symbol &&
      nextProps.symbol.length &&
      nextProps.symbol.length < 2
    )
      return;
    this.showChart(nextProps.symbol);
  }

  showChart(code) {
    if (this.widget && this.widget.chart) {
      const chartObj = this.widget.chart();
      chartObj.setSymbol(code, (response) => {
        console.log(response);
      });
    } else {
      this.getDataChart();
    }
  }

  getDataChart() {
    this.initChart(chartTV_constants.defaultConfig);
  }

  initChart(dataFeed) {
    /* global TradingView */
    const that = this;
    let data = new Datafeeds.UDFCompatibleDatafeed(
      'https://demo_feed.tradingview.com',
      '',
      dataFeed,
      this.callbackSearch.bind(this),
      this.cbSymbol.bind(this),
      this.chartTV
    );
    const option = {
      fullscreen: true,
      interval: 'D',
      container_id: this.id,
      datafeed: data,
      library_path: 'charting_library/',
      locale: 'en',
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      enabled_features: ['chart_property_page_trading'],
      charts_storage_api_version: '1.1',
      client_id: 'abc.com',
      footer_screenshot: false,
      disabled_features: [
        'use_localstorage_for_settings',
        'study_templates',
        'dome_widget',
        'header_layouttoggle',
        'header_screenshot',
        'move_logo_to_main_pane',
        'snapshot_trading_drawings',
        'show_logo_on_all_charts',
      ],
      user_id: 'public_user_id',
      symbol: this.state.symbol,
    };
    this.widget = new TradingView.widget(option);
    this.widget &&
      this.widget.onChartReady &&
      this.widget.onChartReady(function () {
        // createStudy(name, forceOverlay, lock, inputs, callback, overrides, options)
        // this.widget.chart().createStudy('RSI60', false, true);
        // this.widget.chart().createStudy('MACD_Minh', false, false, [14, 30, "close", 9])
        // this.widget && this.widget.chart().createStudy('OverlayMINH', false, false, ['AAPL']);
        const div = document.createElement('div');
        ReactDOM.render(<div className="saveChart">Save</div>, div);

        that.widget.createButton().append(div);
        div.parentNode.parentNode.addEventListener('click', function () {
          console.log(div);
          that.saveLayoutChart(div);
        });
        that.loadLayoutChart(true);
      });
  }

  async loadLayoutChart(init) {
    console.log(
      this.state.symbol,
      this.widget._options,
      this.widget._options.symbol
    );
    if (!init) {
      if (this.state.symbol === this.widget._options.symbol) return;
    }
    this.widget._options.symbol = this.state.symbol;
    let url = CustomTradingViewUrls.getAllLayoutsUrl;
    let listLayout;
    await axios
      .get(url)
      .then((response) => {
        listLayout = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    if (!listLayout) {
      this.widget.load();
      return;
    }
    let indexLayout = listLayout.findIndex(
      (item) => item.symbol === this.state.symbol
    );
    console.log(indexLayout, this.widget);
    if (indexLayout === -1) {
      this.widget.load();
      return;
    }
    let id = listLayout[indexLayout].id;
    url = CustomTradingViewUrls.getSaveLayoutChartUrl(id);
    await axios
      .get(url)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          const savedLayout = JSON.parse(response.data.data.content).content;
          console.log(savedLayout);
          this.widget && this.widget.load && this.widget.load(savedLayout);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  callbackSearch(response) {
    console.log(response);
  }

  cbSymbol(response) {
    console.log(response);
    const that = this;
    // this.props.updateSelectedSymbolSuccess(response.symbol)
    this.setState(
      {
        symbol: response.symbol,
      },
      () => that.loadLayoutChart()
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.initChart(chartTV_constants.defaultConfig);
    }, 0);
  }

  async saveLayoutChart(div) {
    let listLayout;
    await axios
      .get(CustomTradingViewUrls.getAllLayoutsUrl)
      .then((response) => {
        console.log(response);
        listLayout = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    if (!listLayout) return;
    let indexLayout = listLayout.findIndex(
      (item) => item.symbol === this.state.symbol
    );
    this.widget &&
      this.widget.save &&
      this.widget.save((savedObj) => {
        console.log(savedObj);
        var formData = new FormData();
        const content = {
          publish_request_id: uuidv4().substring(0, 12),
          name: `${this.state.symbol}_layout`,
          description: '',
          resolution: 'D',
          symbol_type: 'stock',
          exchange: 'HOSE',
          listed_exchange: '',
          symbol: this.state.symbol,
          short_name: this.state.symbol,
          legs: `[{"symbol":"${this.state.symbol}","pro_symbol":"${this.state.symbol}"}]`,
          content: savedObj,
        };
        formData.append('name', `${this.state.symbol}_layout`);
        formData.append('symbol', this.state.symbol);
        formData.append('resolution', 'D');

        if (indexLayout > -1) {
          // update current layout
          let id = listLayout[indexLayout].id;
          content.id = id;
          formData.append('content', JSON.stringify(content));
          let url = CustomTradingViewUrls.getSaveLayoutChartUrl(id);
          div.innerText = 'Updating';
          axios
            .post(url, formData)
            .then((response) => {
              if (response.data) {
                div.innerText = 'Done';
                setTimeout(() => {
                  div.innerText = 'Save';
                }, 1000);
                console.log(response.data);
              }
            })
            .catch((error) => {
              div.innerText = 'Failed';
              console.log(error.response);
            });
        } else {
          // create new layout
          formData.append('content', JSON.stringify(content));
          div.innerText = 'Createing';
          axios
            .post(CustomTradingViewUrls.getAllLayoutsUrl, formData)
            .then((response) => {
              div.innerText = 'Done';
              setTimeout(() => {
                div.innerText = 'Save';
              }, 1000);
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
              div.innerText = 'Failed';
            });
        }
      });
  }

  render() {
    return (
      <div className="chartTV">
        <article className="chartTV" id={this.id} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  // updateSelectedSymbolSuccess
};

export default connect(null, mapDispatchToProps)(ChartTV);
