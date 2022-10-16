import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../API/vendorAPI';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { addProduct, decrementQuantity, removeProduct } from '../redux/productSlice';
import MinMaxBtns from './UI/MinMaxBtns';

interface productProps {
    product: IProduct;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    detailsId: number;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
}

const Product:React.FC<productProps> = ({product, detailsId, setDetailsId, setIsDetails, setIsOpacity}) => {
    const [numberOf, setNumberOf] = useState(0);
    const [price, setPrice] = useState(0);
    const productRef = useRef<HTMLDivElement | any>();
    const navigate = useNavigate();
    const [myId, setMyId] = useState(1);

    const dispatch = useAppDispatch();
    const {products} = useAppSelector(state => state.product);

    /* useEffect(() => {
        if(numberOf === 0) productRef.current.style.boxShadow = '0px 3px 12px rgba(0, 0, 0, 0.06)';
        else productRef.current.style.boxShadow = '0px 3px 12px rgba(0, 0, 0, 0.06), inset 0px -3px 0px #3F8AE0';
    }, [numberOf]); */

    useEffect(() => {
        if(products !== undefined) {
            let quantity = 0;
            if(products.length > 0) {
                products.forEach(finalProduct => {
                    if(finalProduct.id === product.id) quantity += finalProduct.quantity;
                });
            }
            setNumberOf(quantity);
            setMyId(prev => prev += quantity + 1);
        };
        if(products !== undefined && products.length > 0) {
            let thisPrice = 0;
            products.forEach(thisProduct => {
                if(thisProduct.id === product.id){
                    let thisProductPrice = 0;
                    thisProductPrice += thisProduct.price;
                    thisProduct.ingredients.forEach(thisIngredient => {
                        thisProductPrice += thisIngredient.price;
                    });
                    thisProductPrice *= thisProduct.quantity;
                    thisPrice += thisProductPrice;
                };
            });
            setPrice(thisPrice);
        };
    }, [products]);

    const onClickMinHandler = () => {
        setNumberOf(prev => prev - 1);
        let checker = true;
        for (let j = 0; j < products.length; j++) {
            if(products[j].id === product.id && products[j].quantity > 1) {
                dispatch(decrementQuantity({id: products[j].id, myId: products[j].myId}));
                checker = false;
                break;
            }
        };
        if(checker) dispatch(removeProduct({id: product.id, myId}));
    };

    const onClickMaxHandler = () => {
        const p = new Promise((resolve, reject) => {
            dispatch(addProduct({
                myId: myId,
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                ingredients: [],
            }));
            resolve(true);
            reject(false);
        });
        setNumberOf(prev => prev + 1);
        p.then((data) => {
            if(data) {
                setMyId(prev => prev + 1);
            }
        }).then(() => {
            if(product.hasIngredients === true) navigate(`/details/${product.id}/${myId}`);
        });
    };

    return (
        <div ref={productRef} className='product'>
            <div 
                onClick={() => {
                    setIsDetails(true);
                    setDetailsId(parseInt(product.id));
                    setIsOpacity(true);
                }}
                className='product__img'
            ><img src={product.image || '../images/food.svg'} alt={product.name} />
            </div>
            <div className='product__content'>
                <h2 
                    onClick={() => {
                        setIsDetails(true);
                        setDetailsId(parseInt(product.id));
                        setIsOpacity(true);
                    }}
                    className='product__name'
                >{product.name}</h2>
                <p className='product__weight'>{numberOf > 0 ? <><span className='product__price'>{price}₽</span> {product.weight && `/ ${product.weight} гр `} </> : (product.weight && `${product.weight} гр`)}</p>
                {numberOf === 0 
                    ? <button 
                        onClick={() => {
                            const p1 = new Promise((resolve, reject) => {
                                dispatch(addProduct({
                                    myId: myId,
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    quantity: 1,
                                    image: product.image,
                                    ingredients: [],
                                }));
                                resolve(true);
                                reject(false);
                            });
                            p1.then((data) => {
                                if(data) {
                                    setMyId(prev => prev + 1);
                                }
                            }).then(() => {
                                if(product.hasIngredients === true) navigate(`/details/${product.id}/${myId}`);
                            }) 
                            setNumberOf(1);
                        }}
                        className='product__btn'
                    >{product.price}₽</button>
                    : <MinMaxBtns numberOf={numberOf} onClickMax={onClickMaxHandler} onClickMin={onClickMinHandler} />
                }
            </div>
        </div>
    );
};

export default Product;