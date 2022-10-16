import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProductsTab } from '../API/vendorAPI';
import ModalNavBar, { productsTabs } from '../components/ModalNavBar';
import NavBar from '../components/NavBar';
import ProductDetails from '../components/ProductDetails';
import ProductsList from '../components/ProductsList';
import { useAppDispatch } from '../hooks/hooks';
import { filterProducts } from '../redux/productSlice';

interface mainMenuPageProps {
    productsTabs: IProductsTab[];
    totalPrice: number;
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
    vendorId: number;
}

const MainMenuPage:React.FC<mainMenuPageProps> = ({productsTabs, totalPrice, setTotalPrice, vendorId}) => {
    const [isOpacity, setIsOpacity] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [isDetails, setIsDetails] = useState(false);
    const [detailsId, setDetailsId] = useState(346641476);
    const [activeTab, setActiveTab] = useState(productsTabs[0].id);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let productsTabsNames: productsTabs[] = [];
	productsTabs.map(productTab => {
		productsTabsNames.push({name: productTab.name, id: productTab.id});
	});

    const setTgBtnMainMenu = () => {
        window.Telegram.WebApp.MainButton.onClick(() => {
            dispatch(filterProducts());
            navigate('/cart');
        });
    };

    setTgBtnMainMenu();

    useEffect(() => {
        setTgBtnMainMenu();
    }, []);

    useEffect(() => {
        if(totalPrice !== 0) {
            window.Telegram.WebApp.MainButton.setParams({'color': '#4986CC', 'is_active': true, 'is_visible': true, 'text_color': '#ffffff', 'text': `Заказать | ${totalPrice} ₽`})
            .enable();
        } else {
            window.Telegram.WebApp.MainButton.setParams({'is_active': false, 'is_visible': false})
            .disable();
        }
    }, [totalPrice]);

    return (
        <div>
            {/* <NavBar activeTab={activeTab} setActiveTab={setActiveTab} setIsModal={setIsModal} setIsOpacity={setIsOpacity} productsTabsNames={productsTabsNames} isHamburger={true} ></NavBar>
            <div className='mainMenu'>
                <ProductsList setActiveTab={setActiveTab} productsTabs={productsTabs}/>
                <div onClick={() => {setIsOpacity(false); setIsModal(false)}} style={isOpacity ? {'opacity': '0.35', 'pointerEvents': 'all'} : {'opacity' : '0'}} className='opacity-block'></div>
                <ModalNavBar activeTab={activeTab} setActiveTab={setActiveTab} isModal={isModal} setIsModal={setIsModal} setIsOpacity={setIsOpacity} productsTabsNames={productsTabsNames}/>
            </div>
            <button onClick={() => navigate('/cart')}>Cart</button> */}
            <ProductDetails detailsId={detailsId} isDetails={isDetails} number={1} setDetailsId={setDetailsId} setIsDetails={setIsDetails} setIsOpacity={setIsOpacity} vendorId={vendorId} />
        </div>
    );
};

export default MainMenuPage;