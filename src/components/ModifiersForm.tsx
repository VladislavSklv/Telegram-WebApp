import React, {useState, useEffect} from 'react';
import { IModifier, IModifierScheme, IProduct } from '../API/vendorAPI';
import ModifiersTab from './ModifiersTab';
import { ChosenIngredientI } from './ProductDetails';

interface modifiersFormProps{
    details: IProduct;
    isDetails: boolean;
    isValidation: boolean;
    setChosenModifiers: React.Dispatch<React.SetStateAction<ChosenIngredientI[]>>;
    formRef: React.MutableRefObject<HTMLFormElement | null>;
}

const ModifiersForm:React.FC<modifiersFormProps> = ({details, isDetails, isValidation, setChosenModifiers, formRef}) => {
    const [requiredModifiers, setRequiredModifiers] = useState<IModifierScheme[]>([]);
    const [optionalModifiers, setOptionalModifiers] = useState<IModifierScheme[]>([]);

    /* Splitting modifiers */
    useEffect(() => {
        setRequiredModifiers([]);
        setOptionalModifiers([]);
        if(details.modifierScheme !== undefined && details.modifierScheme.length > 0){
            let required: IModifierScheme[] = [];
            let optional: IModifierScheme[] = [];
            details.modifierScheme.forEach(modifierScheme => {
                if(modifierScheme.isRequired) required.push(modifierScheme);
                else optional.push(modifierScheme);
            });
            setRequiredModifiers(required);
            setOptionalModifiers(optional);
        }
    }, [details]);

    return (
        <form ref={formRef} className='product-id__form'>
            {(requiredModifiers !== undefined && requiredModifiers.length > 0) && 
                <>
                    {requiredModifiers.map(modifierScheme => 
                        <ModifiersTab isDetails={isDetails} isValidation={isValidation} key={modifierScheme.id} setChosenIngredients={setChosenModifiers} groupName={modifierScheme.name} modifiers={modifierScheme.modifiers} isCheckbox={false} />
                    )}
                </>}
            {(optionalModifiers !== undefined && optionalModifiers.length > 0) && 
                <>
                    {optionalModifiers.map(modifierScheme =>
                        <ModifiersTab key={modifierScheme.id} isDetails={isDetails} setChosenIngredients={setChosenModifiers} groupName={modifierScheme.name} modifiers={modifierScheme.modifiers} isCheckbox={true}/>
                    )}
                </>
            }
        </form>
    );
};

export default ModifiersForm;