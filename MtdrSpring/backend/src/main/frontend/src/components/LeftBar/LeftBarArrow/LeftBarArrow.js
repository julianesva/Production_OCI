import './LeftBarArrow.css'
import { Arrow_Left_Icon, Arrow_Right_Icon } from "../../../Icons"

export default function LeftBarArrow({ isLeftBarHidden, setIsLeftBarHidden }) {
    return (
        <div className='leftbar-arrow-button-container'>
            <button onClick={() => setIsLeftBarHidden(!isLeftBarHidden)}>
                {isLeftBarHidden ?
                    <Arrow_Left_Icon color="#312D2A" w='23px' h='23px' />
                    :
                    <Arrow_Right_Icon color="#312D2A" w='23px' h='23px' />
                }
            </button>
        </div>
    )
}