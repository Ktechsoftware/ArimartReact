import React from 'react'
import TopNavBar from '../../components/ProductCategory/TopNavBar'
import CategoryTabs from '../../components/ProductCategory/CategoryTabs'
import DesktopCategory from '../../components/category/DesktopCategory'
import DesktopProducts from '../../components/Products/DesktopProducts'
import ProductCard from '../../components/Products/ProductCard'
import FilterSidebar from '../../components/ProductCategory/FilterSidebar'
import Header from '../../components/Header/Header'

const Searchitems = () => {
  return (
    <div>
       <Header title={"Search"} setbaricon={false} />
        <TopNavBar/>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <DesktopProducts />
          <ProductCard />
        </div>
      </div>
    </div>
  )
}

export default Searchitems