import usePageTitle from "../services/usePageTitle";
import Hero from './Hero'
import Featuredproducts from '../products/Featuredproducts'

export default function Home() {
  usePageTitle();
  return (
    <div>
      <Hero/>
      <Featuredproducts/>
    </div>
  )
}
