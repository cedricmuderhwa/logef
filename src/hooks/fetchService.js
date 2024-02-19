import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findServices } from '../redux/slices/services';

export const LoadServices = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function servicesFetch(){
            const res = await dispatch(findServices())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        servicesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}