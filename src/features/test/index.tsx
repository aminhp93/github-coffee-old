import { Button } from 'antd';
import TestService from '@/services/test';
import { createClient } from '@supabase/supabase-js';
import PushNotificationService from '@/services/pushNotification';
import { getListAllSymbols } from 'features/stock/constants';

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
    await supabase
      .from('stock')
      .select(
        'date,symbol,priceClose,priceHigh,priceLow,priceOpen,dealVolume,totalVolume'
      )
      .in('symbol', getListAllSymbols())
      .gt('date', '2022-12-01');
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
