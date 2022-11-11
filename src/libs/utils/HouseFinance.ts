import { IHouseFinance } from 'libs/types';
import { sumBy, times } from 'lodash';

export const listDataHouseFinance: IHouseFinance[] = [
  {
    ten: 'nha',
    tongGiaTri: 4000,
    laiVay: 0.1,
    tiLeVay: 1,
    thoiGianVay: 240,
    thoiGianBan: 12,
    tiLeBan: 1.1,
    laiPhatTraTruoc: 0.02,
  },
  {
    ten: 'oto',
    tongGiaTri: 700,
    laiVay: 0.1,
    tiLeVay: 0.5,
    thoiGianVay: 240,
    thoiGianBan: 60,
    tiLeBan: 1.5,
    laiPhatTraTruoc: 0.02,
  },
];

export const mapListDataHouseFinance = (data: any) => {
  data.map((i: IHouseFinance) => {
    const tienGoc = i.tongGiaTri / i.thoiGianVay;
    let giaTriConlai = i.tongGiaTri;
    const listTienTra: any = [];
    times(i.thoiGianVay).forEach((j: any, index: number) => {
      if (index !== 0) {
        giaTriConlai = giaTriConlai - tienGoc;
      }
      const tienLai = (giaTriConlai * i.laiVay) / 12;

      listTienTra.push({
        thang: index + 1,
        tienGoc,
        tienLai,
      });
    });

    i.tienTraBanDau = 1;
    i.tienTraHangThang = 1;
    i.tienBan = i.tongGiaTri * i.tiLeBan;
    i.tienGocDaTra = i.thoiGianBan * tienGoc;
    i.tongGocConlai = i.tongGiaTri - i.thoiGianBan * tienGoc;
    i.tienLaiDaTra = sumBy(
      listTienTra.filter((j: any) => j.thang < i.thoiGianBan + 1),
      'tienLai'
    );
    i.tongTienDaTra = i.tienGocDaTra + i.tienLaiDaTra;
    i.tienConPhaiTra = i.tongGocConlai * (1 + i.laiPhatTraTruoc);
    i.tongTra = i.tongTienDaTra + i.tienConPhaiTra;
    i.tongThu = i.tienBan;
    i.laiLo = i.tongThu - i.tongTra;
    return i;
  });
  return data;
};
