import { useCallback, useEffect, useRef, useState } from "react";

type ImageViewType = {
    setImageShow?: React.Dispatch<React.SetStateAction<boolean>>,
    setImageModuleShowRight?: React.Dispatch<React.SetStateAction<boolean>>,
    src:string
}

const ImageView = ({ setImageShow,setImageModuleShowRight, src }: ImageViewType) => {
    console.log(src.substring(src.length-20,src.length-1))
    const ImageElement = useRef<HTMLDivElement | null>(null);
    const [imgLink,setImgLink]=useState<string>("");
    useEffect(()=>{
        setImgLink(src);
        if (ImageElement.current) {
            ImageElement.current.style.top = '20dvh';
            ImageElement.current.style.left = `${window.innerWidth / 2 - ImageElement.current.getBoundingClientRect().width / 2}px`;
        }
    },[src])

    const downloadFun=useCallback(()=>{
        const a = document.createElement('a');
        a.href=imgLink;
        a.setAttribute('download','Rab Tap Chat');
        a.click()
    },[imgLink])
    return (
        <div className='fixed  top-[100dvh] min-h-[60%] max-h-[85%] w-[25vw] sm:w-[95vw] overflow-hidden flex flex-col items-center justify-center shadow-lg bg-[#ffffffb0] dark:bg-[#25223d81] sm:backdrop-blur-md sm:bg-[#ffffffb2] sm:shadow-lg sm:rounded-lg sm:p-4 z-[100]' ref={ImageElement}>
            {
                setImageShow &&
                <label className="absolute top-2 right-2 text-xs h-6 w-6 flex items-center justify-center bg-slate-100 z-10" onClick={()=>{setImgLink("");setImageShow(false)}}>❌</label>
            }
            {
                setImageModuleShowRight &&
                <label className="absolute top-2 right-2 text-xs h-6 w-6 flex items-center justify-center bg-slate-100 z-10" onClick={()=>{setImgLink("");setImageModuleShowRight(false)}}>❌</label>
            }
            
            <div className="h-fit w-fit max-h-80 my-auto">
            <img src={imgLink} alt={imgLink} className="object-cover max-h-[inherit] max-w-[inherit]" />
            
            </div>
            <button className="min-w-full bg-white dark:bg-slate-700 dark:text-gray-200 text-sm font-medium h-10 mt-auto" onClick={downloadFun}>Download Image <i className="fi fi-sr-cloud-download-alt"></i></button>
        </div>
    )
}

export default ImageView