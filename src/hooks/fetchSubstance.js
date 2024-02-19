import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findSubstances } from '../redux/slices/substances';

export const LoadSubstances = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        async function substancesFetch(){
            const res = await dispatch(findSubstances())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        substancesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}