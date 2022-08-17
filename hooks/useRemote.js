import { useState, useEffect } from "react";

export default function useRemote(url, defaultValue){
    const [data, setData] = useState(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(
      () => {
        async function fetchData() {
          try {
            setLoading(true);
            setError(false);
            const res = await fetch(url, { method:'GET', withCredentials: true });
            if(res.status >= 400){
              // use 'catch' to provide a generic backup string
              // better idea : Display a more specific string using res.status
              throw new Error(await res.text().catch(()=>'something went wrong'));
            }
            else setData(await res.json());
          } catch(e) {
            setError(e.message);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      },
      [url],
    );
    return [data, loading, error];  
}