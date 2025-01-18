import { useState, useEffect } from "react";
import {getAllCategories} from './request'

interface CategoriesProps {
  id: string;
  name: string;
}

function Categories() {
  const [categories, setCategories] = useState<CategoriesProps[]>([])

  const fetchCategories = async () => {
    const allCategories = await getAllCategories()
    if(allCategories) {
      setCategories(allCategories)
    }
  }

  useEffect(()=> {
    fetchCategories()
  }, [])

  console.log('this is all categories', categories)
  
  return (
    <div>Categories </div>
  )
}

export default Categories