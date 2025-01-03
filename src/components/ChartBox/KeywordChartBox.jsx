import React, { useRef, useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import CandleChart from './CandleChart';
import CandleChartSimple from '../CandleChartSimple';
import ChartData from './ChartData';
import UserKeywordLike from './UserKeywordLike';
import { useOutletContext } from 'react-router-dom';

export default function KeywordChartBox({
  chartData,
  setChartData,
  stockInfo,
  keywordLikeList,
  bringStockChart,
  period,
  setPeriod,
}) {
  const containerRef = useRef(null); // 전체 컨테이너 참조
  const chartContainerRef = useRef(null); // CandleChart 상위 div 참조
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    bringStockChart(stockInfo.stock_code, setChartData, period);
  }, [period]);

  const moveToStock = (chart_period) => {
    setPeriod(chart_period);
  };

  // 전체 컨테이너 크기 측정
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CandleChart 상위 div 크기 측정
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const entry = entries[0];
        setChartDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (chartContainerRef.current) observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const currData = chartData[chartData.length - 1];

  // 정렬을 변경하는 임계값
  const isCompact = containerDimensions.width / containerDimensions.height <= 5 / 6;

  // CandleChart에 고정된 비율로 높이 조정
  const chartHeight = 600; // 예: 60% 비율로 고정

  return (
    <div ref={containerRef}>
      <div className={`flex ${isCompact ? 'flex-col space-y-4' : 'flex-row space-x-4'} items-start`}>
        {/** chart box */}
        <div
          ref={chartContainerRef} // CandleChart 상위 div 참조
          className={`font-semibold border-2 rounded-xl p-4 ${isCompact ? 'w-full' : 'w-3/4'}`}
        >
          <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3">
            <Tab eventKey="D" title="일봉">
              <CandleChart
                chartData={chartData}
                width={chartDimensions.width || 0} // 상위 div의 너비 전달
                height={chartHeight || 0} // 고정 비율로 높이 전달
              />
            </Tab>
            <Tab eventKey="W" title="주봉">
              <CandleChart
                chartData={chartData}
                width={chartDimensions.width || 0} // 상위 div의 너비 전달
                height={chartHeight || 0} // 고정 비율로 높이 전달
              />
            </Tab>
            <Tab eventKey="M" title="월봉">
              <CandleChartSimple
                chartData={chartData}
                width={chartDimensions.width || 0} // 상위 div의 너비 전달
                height={chartHeight || 0} // 고정 비율로 높이 전달
              />
            </Tab>
          </Tabs>
        </div>

        {/** data box */}
        <div className={`${isCompact ? 'w-full' : 'w-1/4'}`}>
          <ChartData stockInfo={currData} />
          <UserKeywordLike keywordLikeList={keywordLikeList} />
        </div>
      </div>
    </div>
  );
}
