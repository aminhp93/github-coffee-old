import { Button } from 'antd';
import TestService from '@/services/test';
import { createClient } from '@supabase/supabase-js';
import PushNotificationService from '@/services/pushNotification';

const supabaseUrl = 'https://bnimawsouehpkbipqqvl.supabase.co';
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaW1hd3NvdWVocGtiaXBxcXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0NDY4MzcsImV4cCI6MTk4OTAyMjgzN30.K_BGIC_TlWbHl07XX94EWxRI_2Om_NKu_PY5pGtG-hk`;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Test() {
  const test = async () => {
    TestService.test();
  };

  const testStartJob = () => {
    TestService.startJob();
  };

  const testImport = async () => {
    const res = await supabase.from('stock_test').insert([
      {
        adjRatio: 1,
        buyCount: 10675,
        buyForeignQuantity: 4823710,
        buyForeignValue: 97158460000,
        buyQuantity: 36232974,
        currentForeignRoom: 1551815420,
        date: '2023-01-12T00:00:00',
        dealVolume: 20172900,
        priceAverage: 20.11849,
        priceBasic: 20.2,
        priceClose: 20.05,
        priceHigh: 20.25,
        priceLow: 19.9,
        priceOpen: 20.1,
        propTradingNetDealValue: -1386460000,
        propTradingNetPTValue: 0,
        propTradingNetValue: -1386460000,
        putthroughValue: 58202000000,
        putthroughVolume: 3024000,
        sellCount: 9802,
        sellForeignQuantity: 784610,
        sellForeignValue: 15784960000,
        sellQuantity: 43870440,
        symbol: 'HPG',
        totalValue: 464050286921,
        totalVolume: 23196900,
        key: 'HPG_2023-01-12T00:00:00',
      },
    ]);
    console.log(res);
  };

  const testNoti = async () => {
    PushNotificationService.createPushNotification({
      title: 'test',
      body: 'test',
    });
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button size="small" onClick={test}>
        Test
      </Button>
      <Button size="small" onClick={testImport}>
        Test import
      </Button>
      <Button size="small" onClick={testStartJob}>
        testStartJob
      </Button>
      <Button size="small" onClick={testNoti}>
        testNoti
      </Button>
    </div>
  );
}
