import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findContainers } from '../redux/slices/containers';

export const LoadContainers = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
            async function containersFetch(){
            
            const res = await dispatch(findContainers())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        containersFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}