import { useSelector, useDispatch } from "react-redux";
import { removeItem } from '../../reduxStore/slices/cartSlice'
import { message } from 'antd'

interface ProductsProps {
  id: string;
  category: string;
  description: string;
  name: string;
  url: string;
  image: string;
}

function Cart() {
  const dispatch = useDispatch();

  const cart = useSelector(
    (state: {
      cart: {
        items: ProductsProps[];
      };
    }) => state.cart.items
  );

  const handleRemoveItem = (item: ProductsProps)=> {
    dispatch(removeItem(item))
  }

  return (
    <div>
      {cart.length ? (
        <div>
          <h1>Товары в корзине</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            {cart.map((item) => (
              <div key={item.id}>
                <div className="w-[250px] p-4 border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[150px] h-[100px] m-auto"
                  />
                  <div className="mt-6">
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div
                  className="border-x border-b p-2 flex justify-center hover:cursor-pointer"
                  onClick={() => {
                    handleRemoveItem(item)
                    message.success('Товар удален из корзины!')
                  }}
                >
                  Удалить
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>В корзине нет товаров</div>
      )}
    </div>
  );
}

export default Cart;