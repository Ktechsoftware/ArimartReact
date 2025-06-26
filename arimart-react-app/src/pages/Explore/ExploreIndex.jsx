import DailyFoods from '../../components/Explore/DailyFoods'
import Header from '../../components/Header/Header'

function ExploreIndex() {
  return (
    <div className='mb-20'>
       <Header title={"Explore"} setbaricon={false} />
        <DailyFoods/>
    </div>
  )
}

export default ExploreIndex