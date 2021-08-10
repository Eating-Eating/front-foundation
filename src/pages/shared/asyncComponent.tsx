import { useEffect, useState } from "react"

export const AsyncCompoennt = (importComponent:any)=>{
  const [component,setComponent] = useState(null)
  useEffect(()=>{
      importComponent.then((res:any)=>{
        setComponent(res.default)
      }).catch((err:any)=>console.log(err))
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return component ? component : null
}