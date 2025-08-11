import React from 'react'
import SubCategoriesPage from '../../components/Subcategory/SubCategoriesPage'
import Header from '../../components/Header/Header'
import ProductCard from '../../components/Products/ProductCard'
import { useParams } from 'react-router-dom'

const Marketplace = () => {
  const { market,categoryid, subcategory, id } = useParams();
  return (
    <div>
       {/* <Header title={market.charAt(0).toUpperCase() + market.slice(1) + " Market"} setbaricon={false}  setcarticon={false}/> */}
        <SubCategoriesPage mainCategory="Grocery" categoryid={categoryid || 1} />
    </div>
  )
}

export default Marketplace