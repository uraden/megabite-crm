import { useState, useEffect } from "react";
import { getAllProducts } from "../Products/request";
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../../reduxStore/slices/cartSlice";

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

  const cart = useSelector((state: {
    cart: {
      items: unknown[];
    };
  }) => state.cart.items);

  const dispatch = useDispatch();

  const handleAddItem = (item: ProductsProps) => {
    dispatch(addItem(item));
  };

  return (
    <div>
      <h1>Продукты</h1>
      <div className="flex flex-wrap gap-4 mt-4">
        {products.map((product) => (
          <div key={product.id}>
            <div className="w-[250px] p-4 border">
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
            <div
              className="border-x border-b p-2 flex justify-center hover:cursor-pointer"
              onClick={() => handleAddItem(product)} // Dispatch the action here
            >
              В корзину
            </div>
          </div>
        ))}
        <div className="mt-4">
          <h2>Количество в корзине: {cart.length}</h2>
        </div>
      </div>
    </div>
  );
}

export default Main;
