import { useCallback, useState, useMemo } from 'react'

export default function useLocalstorage() {
    const KEY = "wallet";
    const [wallet, setWallet] = useState(null);
    const getItem = useCallback(() => {
        const storedWallet = localStorage.getItem(KEY);
        setWallet(storedWallet ? JSON.parse(storedWallet) : null);
    }, [])
    const setItem = useCallback((value) => {
        localStorage.setItem(KEY, JSON.stringify(value));
        setWallet(value);
    }, []);
    const isExist = useMemo(() => !!wallet, [wallet])
    return {
        wallet,
        getItem,
        setItem,
        isExist
    }
}
