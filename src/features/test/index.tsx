import { Button, Table } from 'antd';
import axios from 'axios';
import config from 'libs/config';
import request, { RedirectUrls } from 'libs/request';
import moment from 'moment';
import React, { useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const baseUrl = config.apiUrl;

export default function Test() {
  const [list, setList] = useState([]);

  const handleClickPushNotication = () => {
    axios({
      url: `${baseUrl}/api/pushnotifications/`,
      method: 'POST',
      data: {
        title: 'Test',
        body: 'finish',
      },
    });
  };

  const handleClickPayment = () => {
    axios({
      url: `${baseUrl}/api/payments/`,
      method: 'POST',
    });
  };

  const handleStartJob = () => {
    axios({
      url: `${baseUrl}/api/test/start-job/`,
      method: 'GET',
    });
  };

  const handleCancelJob = () => {
    axios({
      url: `${baseUrl}/api/test/cancel-job/`,
      method: 'GET',
    });
  };

  const test = async () => {
    try {
      const res = await request({
        url: RedirectUrls.get,
        method: 'GET',
        params: {
          url: 'https://finance.vietstock.vn/data/getstockdealdetail',
          method: 'POST',
          payload:
            'code=VPB&seq=0&__RequestVerificationToken=XdOhxweLi810dUPhpPF2zb0jwdxW8HlHFuKN9O8LlqFVSui70Sb78wOe54bhUP_dOsAdnrRQgnzsBkPfVOFVTQusVI18BAFw09rCZ3iG0CE1',
          headers: JSON.stringify({
            Accept: '*/*',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6',
            Connection: 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie:
              'language=vi-VN; ASP.NET_SessionId=xta2iw1vhl0qbrbyamrpqvtv; __RequestVerificationToken=t0aDnrKvz5kX5GA5v0V2mYDzJirplLNceZOteJcZXmbaXqnMDiy4etBeH9YMLp104c6QyvyT56sKFmHBggDYgH_XIMNiZhAL2-7y8Bw8wwA1; Theme=Light; _ga=GA1.2.1021059025.1671084404; _gid=GA1.2.1200488645.1671084404; AnonymousNotification=; isShowLogin=true; __gpi=UID=00000b90f5824195:T=1671084404:RT=1671084404:S=ALNI_MaWkdNZ3pH1FQ7Cmk42tkowDVsE2w; cto_bundle=Nr67d18lMkJxaDYwUndaamFDJTJCJTJGV2QyWmpRQzZSMUJRZ0YzRm5OYjM1VGxZcGRBTVB0UmZGOSUyRldEN2hvQ0NacjFyTEIza3RvZGpxS0dBTUhac2JHSVlUTkZNUUZYQ2IxQ08wTSUyQjI5ejZENlBFQzVSY2pLdWgyV3RMcUdkJTJGJTJGcXJaS3FNRUh0SVJjeGpPaGpKayUyQjk4SHolMkJqdUlrelhXckE0OUgwanQzZE9KbllTc3dWcGxDUkRBSExxM0VzSEluYXNLM0dwRHE1V0E3RzQ1JTJCNHVDb0VMJTJCTlE5TEZBdyUzRCUzRA; _cc_id=b87127fb46a8e636479e6e4c2e5c6d; panoramaId_expiry=1671689207685; panoramaId=6b3d63f0724174ef8c9491d014404945a702ca10edc47a292d273af4be34fcab; dable_uid=77199305.1659932618305; __gads=ID=d90ce89761abbb3b-22d2357cebd800af:T=1671084404:S=ALNI_MZIydSYhANWpzuE4F7FcTGttsC0pg; finance_viewedstock=VND,VPB,; _dd_s=logs=1&id=86039806-fe62-449b-953c-ea6526337da0&created=1671084403344&expire=1671087059960; _gat_gtag_UA_1460625_2=1; _gat_UA-1460625-2=1',
            Origin: 'https://finance.vietstock.vn',
            Referer: 'https://finance.vietstock.vn/vpb/thong-ke-giao-dich.htm',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua':
              '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          }),
        },
      });
      setList(res.data);
    } catch (e) {}
  };

  const columns = [
    {
      title: 'IsBuy',
      render: (data: any) => {
        return data.IsBuy ? (
          <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
        ) : (
          <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
        );
      },
    },

    {
      title: 'TotalVol',
      dataIndex: 'TotalVol',
      key: 'TotalVol',
    },
    {
      title: 'TradingDate',
      // dataIndex: 'TradingDate',
      // key: 'TradingDate',
      sorter: (a: any, b: any) => a.TradingDate - b.TradingDate,
      render: (data: any) => {
        return (
          data.TradingDate &&
          moment(Number(data.TradingDate.slice(6, 19))).format(
            'DD/MM/YYYY HH:mm:ss'
          )
        );
      },
    },
    {
      title: 'Vol',
      // dataIndex: 'Vol',
      // key: 'Vol',
      sorter: (a: any, b: any) => a.Vol - b.Vol,
    },
  ];

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button onClick={handleClickPayment}>Test payment</Button>
      <Button onClick={handleClickPushNotication}>
        Test Push notification
      </Button>
      <Button onClick={handleStartJob}>Start job</Button>
      <Button onClick={handleCancelJob}>Cancel job</Button>
      <Button onClick={test}>Test</Button>
      <Table dataSource={list} columns={columns} size={'small'} />;
    </div>
  );
}
