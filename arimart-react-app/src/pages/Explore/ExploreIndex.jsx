import DailyFoods from '../../components/Explore/DailyFoods'
import Header from '../../components/Header/Header'
import MobileSearchPage from '../../components/SearchResult/MobileSearchPage'

function ExploreIndex() {
  return (
    <div className='mb-20'>
       <Header title={"Explore"} setbaricon={false} />
        <MobileSearchPage/>
    </div>
  )
}

export default ExploreIndex