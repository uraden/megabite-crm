import { useState, useEffect } from "react";
import { getAllProducts } from "../Products/request";

interface ProductsProps {
  id: string;
  category: string;
  description: string;
  name: string;
  url: string;
  image: string;
}

function Main() {
  const [products, setProducts] = useState<ProductsProps[]>([]);

  const fetchProducts = async () => {
    const products = await getAllProducts();
    if (products) {
      setProducts(products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products);
  return (
    <div>
      <h1>Продукты</h1>
      <div className="flex flex-wrap gap-4 mt-4">
        {products.map((product) => (
          <div>
            <div key={product.id} className="w-[250px] p-4 border">
              <img
                src={product.image}
                alt={product.name}
                className="w-[150px] h-[100px] m-auto"
              />
              <div className="mt-6">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
            </div>
            <div className="border-x border-b p-2 flex justify-center hover:cursor-pointer" onClick={() => console.log('Добавлено в корзину', product.name)}>
              В корзину
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
