import { useState, useEffect } from 'react';
import userApi from '../../services/userApi';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Alarm.css';
import { toast } from 'react-toastify';

function Alarm({ show, handleClose }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [slackId, setSlackId] = useState('');
  const [keywordList, setKeywordList] = useState([]);
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    if (show) {
      bringSlackId();
      bringKeywordList();
      bringStockList();
    }
  }, [show]);

  const handleSwitchChange = () => {
    setIsSwitchOn((prevState) => !prevState); // 스위치 상태를 토글
  };

  const bringSlackId = async () => {
    try {
      const response = await userApi.getCurrentUser();
      setSlackId(response.data.slack_id);
      response.data.slack_id == '' ? setIsSwitchOn(false) : setIsSwitchOn(true);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error.response?.data?.message || error.message);
      toast.error('사용자 정보 조회에 실패했습니다.');
    }
  };

  const bringKeywordList = async () => {
    try {
      const response = await userApi.getKeywordLike();
      setKeywordList(response.data.userKeywords);
    } catch (error) {
      console.error('즐겨찾기한 키워드 조회 실패:', error.response?.data?.message || error.message);
      toast.error('즐겨찾기한 키워드 조회에 실패했습니다.');
    }
  };

  const bringStockList = async () => {
    try {
      const response = await userApi.getStockLike();
      setStockList(response.data.userStocks);
    } catch (error) {
      console.error('즐겨찾기한 종목 조회 실패:', error.response?.data?.message || error.message);
      toast.error('즐겨찾기한 종목 조회에 실패했습니다.');
    }
  };

  const saveAlarm = () => {
    if (isSwitchOn) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (slackId.length === 0) {
        toast.info('슬랙 계정을 입력해주세요');
        return;
      }

      if (!emailRegex.test(slackId)) {
        toast.info('슬랙 계정을 이메일 형식으로 입력해주세요');
        return;
      }

      const selectedKeywords = keywordList.filter((item) => item.alarm_status === 1);
      const selectedStocks = stockList.filter((item) => item.alarm_status === true);

      if (selectedKeywords.length === 0 && selectedStocks.length === 0) {
        toast.info('알림을 받을 키워드나 종목을 하나 이상 선택해주세요');
        return;
      }

      try {
        userApi.updateSlackId({ slack_id: slackId });
        keywordList.map((el, i) => {
          userApi.updateKeywordLike({ id: el.id, alarm_status: el.alarm_status });
        });
        stockList.map((el, i) => {
          userApi.updateStockLike({ id: el.id, alarm_status: el.alarm_status });
        });
        handleClose();
      } catch (error) {
        console.error('사용자 정보 수정 실패:', error.response?.data?.message || error.message);
        toast.error('사용자 정보 수정에 실패했습니다.');
      }
    } else {
      try {
        userApi.updateSlackId({ slack_id: '' });
        handleClose();
      } catch (error) {
        console.error('사용자 정보 수정 실패:', error.response?.data?.message || error.message);
        toast.error('사용자 정보 수정에 실패했습니다.');
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="font-sans p-4 flex-col">
          <div className="flex justify-end">
            <CloseButton onClick={handleClose} />
          </div>

          <div className="flex mb-3 items-center gap-2">
            <h3 className="text-2xl font-extrabold">나만의 키워드/종목 알림 받기</h3>
            <Form>
              <Form.Check
                type="switch"
                className="text-blue-200 text-2xl"
                checked={isSwitchOn} // 스위치 상태에 따라 checked 상태 변경
                onChange={handleSwitchChange} // 스위치 토글시 상태 변경
              ></Form.Check>
            </Form>
          </div>
          <div className="text-md py-2 border-b-2">
            <span className="font-semibold">즐겨찾기한 키워드</span>와 <span className="font-semibold">종목</span>에
            대한 <span className="font-semibold">순위 알림</span>을 받을 수 있어요
          </div>

          {/* isSwitchOn이 true일 때만 아래 내용 표시 */}
          {isSwitchOn && (
            <>
              <div className="text-md font-semibold mt-4">
                <a
                  href="https://join.slack.com/t/team-stockey/shared_invite/zt-2uj3dnj2u-JwP4~_dzpDr1yT~MAS59_A"
                  target="_blank" // 새 탭에서 링크 열기
                  rel="noopener noreferrer" // 보안상 권장되는 속성
                  className="text-blue-200 hover:underline"
                >
                  링크 열기
                </a>
                를 클릭하여 stockey 슬랙에 참여한 후, 참여한 슬랙 계정을 입력해주세요
              </div>
              <div className="mt-2">
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      placeholder="슬랙 계정을 입력해주세요"
                      value={slackId}
                      onChange={(e) => setSlackId(e.target.value)}
                      autoFocus
                      className="bg-gray-100 border-0  rounded-md"
                    />
                  </Form.Group>
                </Form>
              </div>
              <div className="text-md font-semibold mt-4">
                알림을 받을 <span className="text-blue-200">키워드</span>를 선택해주세요
              </div>
              <div>
                {keywordList?.length > 0 ? (
                  keywordList?.map((item, index) => (
                    <div
                      key={index}
                      className={`inline-block px-2 py-1 m-1 rounded-md font-semibold text-sm ${item.alarm_status == true ? 'bg-blue-100' : 'bg-gray-100'} active:bg-blue-100  hover:cursor-pointer`}
                      onClick={() => {
                        keywordList[index].alarm_status = keywordList[index].alarm_status == 1 ? 0 : 1;
                        setKeywordList([...keywordList]);
                      }}
                    >
                      {item.keyword}
                    </div>
                  ))
                ) : (
                  <div className="py-5 flex flex-col justify-center items-center font-semibold">
                    <h2 className=" text-gray-800">즐겨찾기한 키워드가 없습니다</h2>
                    <p className="text-sm text-blue-200">관심 있는 키워드를 즐겨찾기에 추가해보세요</p>
                  </div>
                )}
              </div>
              <div className="text-md font-semibold mt-4">
                알림을 받을 <span className="text-blue-200">종목</span>을 선택해주세요
              </div>
              <div>
                {stockList?.length > 0 ? (
                  stockList?.map((item, index) => (
                    <div
                      key={index}
                      className={`inline-block px-2 py-1 m-1 rounded-md font-semibold text-sm ${item.alarm_status == true ? 'bg-blue-100' : 'bg-gray-100'} active:bg-blue-100  hover:cursor-pointer`}
                      onClick={() => {
                        stockList[index].alarm_status = stockList[index].alarm_status == true ? false : true;
                        setStockList([...stockList]);
                      }}
                    >
                      {item.stock_name}
                    </div>
                  ))
                ) : (
                  <div className="py-5 flex flex-col justify-center items-center font-semibold">
                    <h2 className=" text-gray-800">즐겨찾기한 종목이 없습니다</h2>
                    <p className="text-sm text-blue-200">관심 있는 종목을 즐겨찾기에 추가해보세요</p>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => {
                saveAlarm();
              }}
              className="hover:bg-blue-100 bg-blue-200 hover:border-blue-100 font-sans font-md"
            >
              저장
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Alarm;
