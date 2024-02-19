import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findMaterials } from '../redux/slices/materials';

export const LoadMaterials = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function materialsFetch(){
            
            const res = await dispatch(findMaterials())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        materialsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}