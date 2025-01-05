import React from 'react';
import { Timeline } from 'antd';

const DATA = [
  {
    date: '2025-01-06',
    endDate: '2025-01-26',
    content: 'Australia Open',
  },
  {
    date: '2025-08-25',
    endDate: '2025-09-07',
    content: 'US Open',
  },
  {
    date: '2025-11-11',
    content: 'Wedding ',
  },
  {
    date: '2025-01-01',
    content: 'Gio ba',
  },
  {
    date: '2025-01-02',
    content: 'Gio ong noi',
  },
  {
    date: '2025-01-03',
    content: 'Gio ong ngoai',
  },
];

const Roadmap: React.FC = () => {
  const sortedData = DATA.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return (
    <>
      <div>https://app.clickup.com/2576368/v/l/6-901207099751-1</div>
      <div>https://roadmap.sh/frontend</div>
      <div>API event</div>
      <Timeline
        mode="left"
        items={sortedData.map((i) => {
          return {
            label: (
              <div>
                <div>{i.date}</div>
                {i.endDate && (
                  <div
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    {i.endDate}
                  </div>
                )}
              </div>
            ),
            children: i.content,
          };
        })}
      />
    </>
  );
};

export default Roadmap;
