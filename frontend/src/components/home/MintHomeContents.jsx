//packages
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MintBanner from './MintBanner'
//modules
import '../../styles/MintHomeContents.css'
//components
import MintVerticalCard from '../common/MintVerticalCard'

export default function MintHomeContents() {
  const makeOpenList = testData =>
    testData.map(concert => <MintVerticalCard key={concert.date} concertData={concert} width="100%" height="150px" />)

  const makeNotOpenList = testData =>
    testData.map(concert => <MintVerticalCard key={concert.date} concertData={concert} width="50%" height="120px" />)

  return (
    <>
      <MintBanner />
      {makeOpenList(testData)}
      <div className="MintHome__subTitle">
        <p>오픈 예정</p>
        <ChevronRightIcon />
      </div>
      <div className="MintHome__notOpenList">{makeNotOpenList(testData2)}</div>
    </>
  )
}

// 테스트 데이터
const testData = [
  {
    img: '1번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '1번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '1번 가수',
    date: '1번 날짜',
  },
  {
    img: '2번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '2번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '2번 가수',
    date: '2번 날짜',
  },
  {
    img: '3번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '3번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '3번 가수',
    date: '3번 날짜',
  },
]
const testData2 = [
  {
    img: '1번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '1번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '1번 가수',
    date: '1번 날짜',
  },
  {
    img: '2번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '2번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '2번 가수',
    date: '2번 날짜',
  },
  {
    img: '3번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '3번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '3번 가수',
    date: '3번 날짜',
  },
  {
    img: '4번 포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터포스터',
    title: '4번 제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목',
    singer: '4번 가수',
    date: '4번 날짜',
  },
]
