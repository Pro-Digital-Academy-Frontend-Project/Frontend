import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChartBox from '../../components/ChartBox/ChartBox';
import SearchInput from '../../components/SearchInput'; //검색 버튼
import LikeButton from '../../components/LikeButton'; //좋아요 버튼
import { removeLike, addLike, findInitialLikeStock } from '../../utils/likeFunction'; //즐겨찾기 관련 함수
import { bringStockChart, bringStockInfo, searchStock } from '../../utils/stockFunction'; //주식 정보 조회 관련 함수
import CustomWordCloud from '../../components/WordCloud';
import keywordApi from '../../services/keywordApi';
import { useLikeContext } from '../../utils/likeContext';
import { toast } from 'react-toastify';

export default function StockChartPage() {
  const [search, setSearch] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  // const [stockLikeList, setStockLikeList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({});
  const [keywordRank, setKeywordRank] = useState([]);
  const { stock_id } = useParams(); //useParams를 통해 경로에서 주식 id 가져옴
  const [period, setPeriod] = useState('D');

  const { stockLikeList, setStockLikeList } = useLikeContext();

  // 종목 로고 Path
  const imagePath = `/company_logo/${stockInfo.stock_code}.png`;

  //1. 주식 id 변경 시, 주식 id로 나머지 주식 정보 조회(stock_code, stock_name 등)
  useEffect(() => {
    if (stock_id) {
      //stock_id와 stockInfo update useState를 매개변수로 전달
      bringStockInfo(stock_id, setStockInfo);
    }
  }, [stock_id]);

  //2. 주식 id를 통해 주식 정보(stockInfo)를 업데이트 => stockInfo가 변경될 시, 차트 데이터 및 즐겨찾기한 종목 조회
  useEffect(() => {
    if (stockInfo.stock_code) {
      //주식 차트 조회
      bringStockChart(stockInfo.stock_code, setChartData, period); //주식 정보에서 stock_code, ChartData update useState, 초기 일봉('D')으로 조회
    }
    if (stockInfo.stock_id) {
      //즐겨찾기 리스트 및 현재 종목 즐겨찾기 상태 조회
      findInitialLikeStock(stockInfo.stock_id, setIsLiked, setStockLikeList); //주식 정보에서 stock_id, 현재 주식에 대한 즐겨찾기 상태 업데이트 변수, 즐겨찾기 리스트 상태 업데이트 변수
      getStockRankAboutKeyword();
    }
  }, [stockInfo]);

  //검색 컴포넌트 실행 시, 검색 함수
  const handleSearch = () => {
    searchStock(search, setSearchResult); //(검색어, 검색 결과 상태 업데이트 변수) => 이 부분은 키워드 검색 api로 대체해서 사용해주세요
  };

  //종목 즐겨찾기 추가 함수
  const handleAddLike = () => {
    addLike(stockInfo.stock_id, stockInfo.stock_name, setStockLikeList);
    setIsLiked(true); // 상태 직접 관리
  };

  //종목 즐겨찾기 삭제 함수
  const handleRemoveLike = () => {
    removeLike(stockInfo.stock_id, setStockLikeList);
    setIsLiked(false); // 상태 직접 관리
  };

  //종목별 키워드 랭킹 조회 함수
  const getStockRankAboutKeyword = async () => {
    try {
      const response = await keywordApi.getKeywordRankAboutStock(stockInfo.stock_id);
      setKeywordRank(response.data.keyword_rankings);
    } catch (error) {
      console.error('키워드 랭킹 조회 실패:', error.response?.data?.message || error.message);
      toast.error('키워드 랭킹 조회에 실패했습니다...');
    }
  };

  return (
    <div className="text-black_default flex-grow bg-white">
      {/** header */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-row">
              {/* 종목 로고 이미지 */}
              <img
                src={imagePath}
                alt={`Stock Logo ${stockInfo.stock_code}`}
                onError={(e) => {
                  // 이미지 로드 실패 시 대체 이미지 처리
                  e.target.src = '/company_logo/default.png';
                }}
                className="w-10 h-10 rounded-xl mr-2"
              />
              <div className="font-extrabold text-4xl">
                {stockInfo.stock_name}
                <span className="text-gray-400 font-bold"> {stockInfo.stock_code}</span>
              </div>
            </div>
            <LikeButton isLiked={isLiked} addLike={handleAddLike} removeLike={handleRemoveLike} />
          </div>
          <SearchInput
            setSearch={setSearch} //검색어 update 변수
            searchResult={searchResult} //검색 결과 변수
            setSearchResult={setSearchResult} //검색 결과 update 변수
            searchStock={handleSearch} //검색 시 실행하는 함수
          />
        </div>
      </div>

      <div>
        <ChartBox
          chartData={chartData} //차트 데이터
          setChartData={setChartData} //차트 업데이트 변수
          stockInfo={stockInfo} //주식 정보(stock_id, stock_code, stock_name 등아 포함된 객체)
          stockLikeList={stockLikeList} //주식 즐겨찾기 list
          bringStockChart={bringStockChart} //주식 차트 데이터 조회 함수
          period={period}
          setPeriod={setPeriod}
        />
      </div>
      <div className="mt-5">
        <div className="font-bold text-2xl my-3">
          <span className="text-blue-200 text-3xl">[ </span>
          {stockInfo.stock_name}
          <span className="text-blue-200 text-3xl"> ]</span> 관련 뉴스에서 주목받은 키워드 한눈에 보기
        </div>
        <CustomWordCloud data={keywordRank} width={800} height={400} />
      </div>
    </div>
  );
}
