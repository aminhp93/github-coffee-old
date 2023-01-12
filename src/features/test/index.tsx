import { Button } from 'antd';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnimawsouehpkbipqqvl.supabase.co';
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaW1hd3NvdWVocGtiaXBxcXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0NDY4MzcsImV4cCI6MTk4OTAyMjgzN30.K_BGIC_TlWbHl07XX94EWxRI_2Om_NKu_PY5pGtG-hk`;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Test() {
  const test = async () => {
    let { data, error } = await supabase
      .from('stock')
      .select(
        'date,symbol,priceClose,priceHigh,priceLow,priceOpen,dealVolume,totalVolume'
      )
      .in('symbol', [
        'HPG',
        'NKG',
        'NTL',
        'PDR',
        'TIG',
        'CTS',
        'VCI',
        'VND',
        'OIL',
        'MST',
        'HAX',
        'HVN',
        'PET',
        'CTR',
      ]);
    console.log(data, error);
  };

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button size="small" onClick={test}>
        Test
      </Button>
    </div>
  );
}
