import './LeftBar.css'
import { useState } from 'react'
import { Arrow_Left_Icon, Arrow_Right_Icon } from '../../Icons'

export default function LeftBar() {
    const [isLeftBarHidden, setIsLeftBarHidden] = useState(false)

    return (
        <div className='leftbar-main'>
            {/* Hide | Unhide LeftBar Button */}
            <div className='leftbar-arrow-button-container'>
                <button onClick={() => setIsLeftBarHidden(!isLeftBarHidden)}>
                    {isLeftBarHidden ?
                        <Arrow_Left_Icon color="#312D2A" w='23px' h='23px' />
                        :
                        <Arrow_Right_Icon color="#312D2A" w='23px' h='23px' />
                    }
                </button>
            </div>

            {isLeftBarHidden ?
                <>
                    {/* LeftBar links */}
                    <div className='leftbar-links-container'>
                        <button>
                            <p className='leftbar-links-text'>View my Teams</p>
                        </button>

                        <button>
                            <p className='leftbar-links-text'>Dashboard</p>
                        </button>

                        <button>
                            <p className='leftbar-links-text'>Quality</p>
                        </button>
                        
                        <button>
                            <p className='leftbar-links-text'>Design</p>
                        </button>
                        
                        <button>
                            <p className='leftbar-links-text'>Bugs</p>
                        </button>
                        
                        <button>
                            <p className='leftbar-links-text'>Releases</p>
                        </button>
                    </div>

                    <div className='leftbar-links-container'>
                        <button>
                            <p className='leftbar-links-text'>Settings</p>
                        </button>
                    </div>
                </>
            : null}
        </div>
    )
}