import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import {  IProduct, useGetProductsMenuQuery } from './API/vendorAPI';
import ErrorBlock from './components/ErrorBlock';
import Loader from './components/Loader';
import { useAppSelector } from './hooks/hooks';
import CartPage from './pages/CartPage';
import MainMenuPage from './pages/MainMenuPage';
import { IfinalProduct } from './redux/productSlice';

interface IProductsGroup {
	id: number;
	name: string;
	products: IProduct[];
}

interface IMyIngredient {
	id: number;
	name: string;
    price: number;
    groupId: number;
    minAmount: number;
    maxAmount: number;
    isRequired: boolean;
}

interface IIngredientsGroup {
	id: number;
    name: string;
	ingredients: IMyIngredient[]
}

interface IMyMainObjects {
	products: IProductsGroup[];
	ingredients: IIngredientsGroup[];
}

function App() {
	const [searchParams, setSearchParams] = useSearchParams();
	let companyId = searchParams.get('companyId');
	if(companyId === null) companyId = '';
	/* /?companyId=0dbf041b-b529-42a9-a45c-23f8cfed6ba9 */
	const productProps = {companyId: companyId};
	const {data: products, isLoading, isError} = useGetProductsMenuQuery(productProps);
	const [totalPrice, setTotalPrice] = useState(0);
	const [isCart, setIsCart] = useState(false);

	useEffect(() => {
		console.log(products, isLoading, isError);
	}, [products, isLoading, isError]);

	const {products: finalProducts} = useAppSelector(state => state.product);
	const navigate = useNavigate();

	/* Counting total price */
	useEffect(() => {
		if(finalProducts !== undefined && finalProducts.length > 0) {
			let price: number = 0;
			let allProductsStringify: string[]  = [];
			let allProducts: IfinalProduct[] = [];
			finalProducts.forEach(product => {
				if(!allProductsStringify.includes(JSON.stringify(product))) allProductsStringify.push(JSON.stringify(product));
			});
			allProductsStringify.forEach(product => allProducts.push(JSON.parse(product)));
			allProducts.forEach(product => {
				let thisPrice = product.price
				if(product.ingredients !== undefined && product.ingredients.length > 0) product.ingredients.forEach(ingredient => thisPrice += ingredient.price);
				thisPrice *= product.quantity;
				price += thisPrice;
			});
			setTotalPrice(price);
		} else setTotalPrice(0);
	}, [finalProducts]);

	/* Setting telegram main button */
	window.Telegram.WebApp.MainButton.color = '#FF6900'
	window.Telegram.WebApp.MainButton.textColor = '#FFFFFF';

	/* Setting Telegram Back Button */
	window.Telegram.WebApp.enableClosingConfirmation();
	
	const backBtn = () => {
		if(isCart){
			navigate(`/?companyId=${productProps.companyId}`);
			setIsCart(false);
		} else {
			window.Telegram.WebApp.close();
		}
	};

	useEffect(() => {
		if(isCart) window.Telegram.WebApp.BackButton.show();
		else window.Telegram.WebApp.BackButton.hide();
	}, [isCart]);

	useEffect(() => {
		window.Telegram.WebApp.onEvent('backButtonClicked', backBtn);
		return () => {
			window.Telegram.WebApp.offEvent('backButtonClicked', backBtn);
		};
	}, [backBtn]);

	/* Haptic feedback */
	useEffect(() => {
		window.Telegram.WebApp.HapticFeedback.selectionChanged();
	}, [finalProducts]);


	return (
		<Routes>
			{products && products !== undefined && <Route path='/' element={<MainMenuPage isCart={isCart} setIsCart={setIsCart} totalPrice={totalPrice} companyId={productProps.companyId} products={products.data} />} />}
			{isLoading && <Route path='/' element={<Loader/>} />}
			{isError && <Route path='/' element={<ErrorBlock/>} />}
			<Route path='/cart' element={<CartPage isCart={isCart} setIsCart={setIsCart} totalPrice={totalPrice} companyId={productProps.companyId} />}/>
		</Routes>
	);
}

export default App;
