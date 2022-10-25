import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
	const productProps = {vendorId:'81225'};
	const {data: products, isLoading, isError} = useGetProductsMenuQuery(productProps);
	const [totalPrice, setTotalPrice] = useState(0);
	const [isCart, setIsCart] = useState(false);

	const {products: finalProducts} = useAppSelector(state => state.product);
	const navigate = useNavigate();

	/* let productsAndIngredients: IMyMainObjects = {ingredients: [], products: []};
	useEffect(() => {
		if(data !== undefined){
			let products: IProductsGroup[] = [];
			data.productCategories.forEach(productCategory => {
				let productsInCategory: IProduct[] = [];
				data.products.forEach(product => product.categoryId === productCategory.id && productsInCategory.push(product));
				products.push({id: productCategory.id, name: productCategory.name, products: productsInCategory});
			});

			let ingredients: IIngredientsGroup[] = [];
			data.modifierGroups.forEach(ingredientGroup => {
				let ingredientsInCategory: IMyIngredient[] = []
				data.modifierSchemes.forEach(ingredientScheme => {
					let ingredientInSchrmr
					data.modifiers.forEach(ingredient => {

					});
				});
				ingredients.push({id: ingredientGroup.id, name: ingredientGroup.name, ingredients: ingredientsInCategory});
			});

			productsAndIngredients = {products, ingredients};
		};
	}, [data]); */

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
			navigate('/');
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
			{products !== undefined && <Route path='/' element={<MainMenuPage isCart={isCart} setIsCart={setIsCart} totalPrice={totalPrice} vendorId={parseInt(productProps.vendorId)} productsTabs={products} />} />}
			{isLoading && <Route path='/' element={<Loader/>} />}
			{isError && <Route path='/' element={<ErrorBlock/>} />}
			<Route path='/cart' element={<CartPage isCart={isCart} setIsCart={setIsCart} totalPrice={totalPrice} vendorId={productProps.vendorId} />}/>
		</Routes>
	);
}

export default App;
