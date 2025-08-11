import DailyFoods from '../../components/Explore/DailyFoods'
import TopProducts from '../../components/Explore/TopProducts'
import Header from '../../components/Header/Header'
import MobileSearchPage from '../../components/SearchResult/MobileSearchPage'

function SubcategoryExplore() {
  return (
    <div className='mb-20'>
       {/* <Header title={"Explore"} setbaricon={false} /> */}
        <TopProducts/>
    </div>
  )
}

export default SubcategoryExplore