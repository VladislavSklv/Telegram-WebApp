import React, { useEffect } from 'react';
import ProductInCart from '../components/ProductInCart';
import { useAppSelector } from '../hooks/hooks';

const CartPage: React.FC = () => {
    const {products} = useAppSelector(state => state.product);

    useEffect(() => {
        let totalPrice = 0;
        products.forEach(product => {
            totalPrice += product.price * product.quantity;
        });
        Telegram.WebApp.MainButton.setParams({'is_visible': true, 'text': `Заказать | ${totalPrice} ₽`})
    }, [products]);

    return (
        <div className='cart'>
            <div className='cart__title-with-icon'>
                <h1 className='title'>Корзина</h1>
                <div><img src="../../trash.svg" alt="cart"/></div>
            </div>
            <div className='cart__wrapper'>
                {products !== undefined && products.map(product => (
                    <ProductInCart product={product} />
                ))}
            </div>
        </div>
    );
};

export default CartPage;