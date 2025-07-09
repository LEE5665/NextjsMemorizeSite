'use client'

import { useEffect, useState } from 'react'

export default function StrictModeTest() {
  let renderCount = 0;
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    //마운트
    renderCount++;
    setRendered(true);
    console.log("mount", renderCount); //1
    return () => {
      //언마운트
      console.log("unmount");
    };
  }, []);

  useEffect(() => {
    //리마운트
    if (rendered) {
      console.log("remount", renderCount); //2
    }
  }, [rendered]);
}
