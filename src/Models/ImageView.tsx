import { useEffect, useRef } from "react";

type ImageViewType = {
    setImageShow: React.Dispatch<React.SetStateAction<boolean>>,
    src:string
}

const ImageView = ({ setImageShow, src }: ImageViewType) => {
    const ImageElement = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if (ImageElement.current) {
            ImageElement.current.style.top = '20dvh';
            ImageElement.current.style.left = `${window.innerWidth / 2 - ImageElement.current.getBoundingClientRect().width / 2}px`;
        }
    }, [])

    return (
        <div className='fixed z-10 top-[100dvh] min-h-[60%] max-h-[85%] w-[25vw] md:w-[90vw] flex flex-col items-center justify-center shadow-lg bg-[#ffffffb0] md:backdrop-blur-md md:bg-[#ffffffb2] md:shadow-lg md:rounded-lg md:p-4' ref={ImageElement}>
            <label className="absolute top-2 right-2 text-xs h-6 w-6 flex items-center justify-center bg-slate-300" onClick={()=>{setImageShow(false)}}>❌</label>
            <img src={src} alt={src} className="object-cover" />
        </div>
    )
}

export default ImageView