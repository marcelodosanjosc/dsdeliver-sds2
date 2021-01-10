import { useEffect, useState } from 'react';
import './styles.css';
import StepsHeader from './StepsHeader';
import ProductsList from './ProductsList';
import { fetchproducts } from '../api';
import OrderLocation from './OrderLocation';
import { OrderLocationdata, Product } from './types';



function Orders(){
  const [products, setProducts] = useState<Product[]>([]);
  const [orderLocation, setOrderLocation] = useState<OrderLocationdata>();
 
  
    
  useEffect(() => {
    fetchproducts()
    .then(response => setProducts(response.data))
    .catch(error => console.log(error)
    )
  }, []);

    return(
     <div className="orders-container">
       <StepsHeader />
       <ProductsList products={products}/>
       <OrderLocation onChangeLocation={location => setOrderLocation(location)}/>
     </div>
    )

}

export default Orders;