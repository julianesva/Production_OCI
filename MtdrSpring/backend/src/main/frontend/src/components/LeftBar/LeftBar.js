import './LeftBar.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LeftBarArrow from './LeftBarArrow/LeftBarArrow'

export default function LeftBar() {
    const [isLeftBarHidden, setIsLeftBarHidden] = useState(false)

    const navigate = useNavigate()

    const handleNavigate = (path) => {
        navigate(path)
    }

    return (
        <div className='leftbar-main'>
            {/* LeftBar Arrow Button */}
            <LeftBarArrow isLeftBarHidden={isLeftBarHidden} setIsLeftBarHidden={setIsLeftBarHidden} />

            {/* LeftBar Container */}
            {isLeftBarHidden ?
                <div className='leftbar-container'>
                    {/* LeftBar links */}
                    <div className='leftbar-links-container'>
                        <div className='leftbar-links-text-container'>
                            <button onClick={() => handleNavigate('/')}>
                                <p className='leftbar-links-text'>Dashboard</p>
                            </button>

                            <button onClick={() => handleNavigate('/report')}>
                                <p className='leftbar-links-text'>Report</p>
                            </button>
                        </div>

                        {/* <div className='leftbar-links-text-container'>
                            <button>
                                <p className='leftbar-links-text'>Settings</p>
                            </button>
                        </div> */}
                    </div>

                    {/* LeftBar Arrow Button */}
                    <LeftBarArrow isLeftBarHidden={isLeftBarHidden} setIsLeftBarHidden={setIsLeftBarHidden} />
                </div>
            : null}
        </div>
    )
}