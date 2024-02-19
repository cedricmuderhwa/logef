import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findRegions } from '../redux/slices/regions';

export const LoadRegions = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function regionsFetch(){
            const res = await dispatch(findRegions())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        regionsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}