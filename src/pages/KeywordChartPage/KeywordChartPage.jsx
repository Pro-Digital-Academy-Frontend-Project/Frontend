import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikeButton from '../../components/LikeButton';
import { findInitialLikeKeyword, keywordAddLike, keywordRemoveLike } from '../../utils/likeFunction';
import { searchKeyword, setUpKeywordDataAndStockInfo } from '../../utils/keywordFunction';
import SearchKeywordInput from '../../components/SearchKeywordInput';
import { bringStockChart } from '../../utils/stockFunction';
import KeywordChartBox from '../../components/ChartBox/KeywordChartBox';

  export default function KeywordChartPage() {
    const { keyword_id } = useParams();
    const [chartData, setChartData] = useState([]);
    const [isLiked, setIsLiked] = useState(false); // 초기 좋아요 상태
    const [keywordData, setKeywordData] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState()
    const [keywordLikeList, setKeywordLikeList] = useState([]);
    const [stockInfo, setStockInfo] = useState({});
    const [period, setPeriod] = useState('D');

    // 키워드 데이터 가져오기
    useEffect(() => {
      setUpKeywordDataAndStockInfo(keyword_id, setKeywordData, setStockInfo)
      // console.log("KeywordData => ", keywordData)
      // console.log("StockINFO => ", stockInfo)
      console.log("12132312 =>",keywordLikeList)
    }, [keyword_id])

    useEffect(() => {
      if (stockInfo.stock_code) {
        bringStockChart(stockInfo.stock_code, setChartData, period); //주식 정보에서 stock_code, ChartData update useState, 초기 일봉('D')으로 조회
      }
      if (stockInfo.stock_id) {
        // keywordData.keyword
        findInitialLikeKeyword(keywordData.keyword, setIsLiked, setKeywordLikeList);
      }
    }, [stockInfo])

    // 즐겨찾기 추가 핸들링
    const handleAddLike = () => {
      keywordAddLike(keywordData.keyword, setKeywordLikeList)
      setIsLiked(true);
    }

    // 즐겨찾기 삭제 핸들링
    const handleRemoveLike = () => {
      keywordRemoveLike(keywordData.keyword, setKeywordLikeList, keywordData)
      setIsLiked(false);
    }

    // 검색함수 핸들링
    const handleSearch = () => {
      searchKeyword(search, setSearchResult)
    }

    return (
      <div className="text-black_default flex-grow bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-4xl">{keywordData?.keyword|| '로딩 중...'}</div>
            <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
          </div>
          <SearchKeywordInput
            setSearch={setSearch}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            searchKeyword={handleSearch}
          />
          </div>
          <div>
            <KeywordChartBox
              chartData={chartData} // 차트 데이터
              setChartData={setChartData}
              stockInfo={stockInfo} // 주식 정보 {stock_id, stock_code, stock_name}
              keywordLikeList={keywordLikeList} // 키워드 즐겨찾기 List
              bringStockChart={bringStockChart} // 주식 차트 데이터 조회
              period={period} // 일봉, 주봉, 월봉 (default : 일봉)
              setPeriod={setPeriod}
            />
          </div>
      </div>
    );
  }

