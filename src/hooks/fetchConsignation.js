import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findConsignations } from '../redux/slices/consignations';

export const LoadConsignations = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function consignationsFetch(){
            
            const res = await dispatch(findConsignations())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        consignationsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}