import React, { useState, useContext } from 'react';
import '../css/menuEditor.css';
import { FaHome } from 'react-icons/fa';
import { HiAdjustmentsHorizontal, HiEnvelope } from 'react-icons/hi2';
import { AudioContext } from '@/context/AudioContext';
// import Envelope from '@/functions/Envelope';
import { SiAudioboom } from 'react-icons/si';
import RegionsAudio from '@/functions/RegionsAudio';

const menuItems = [
    { id: 'filters', name: 'Bộ lọc', icon: <HiAdjustmentsHorizontal /> },
    { id: 'envelop', name: 'Kiểm soát âm thanh', icon: <HiEnvelope /> },
    { id: 'region', name: 'Quản lý vùng âm thanh', icon: <SiAudioboom /> }
]

export default function MenuAudioEditor({ onMode }) {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { setMode } = useContext(AudioContext);

    const handleMenuClick = (item) => {
        setSelectedMenu(item);
        onMode(item);
        setMode(item);
    }

    return (
        <section id="menu-bar">
            <div className="menu-left">
                <div className="toggle-home" id="toggle-home">
                    <div
                        id="toggle-home-box"
                        className='toggle-home-box'
                        onMouseEnter={() => setHoveredItem('home')}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        <FaHome id="home-icon" className="home-icon" />
                        <span id="home-span" className="home-span">
                            Trang chủ
                        </span>
                    </div>
                </div>
                <div className="splitter"></div>
                <ul id="tool-menu" className="tool-menu">
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            data={item.id}
                            id={`menu-item-box ${item.id}`}
                            className={`menu-item-box ${hoveredItem === item.id ? 'hovered' : ''} ${selectedMenu === item.id ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.id)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <div className="menu-item-icon">{item.icon}</div>
                            <span className="menu-item-span">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="menu-right">
                {/* {selectedMenu === 'envelop' && (<Envelope />)} */}
                {selectedMenu === 'region' && (<RegionsAudio />)}
            </div>
        </section>
    )
}
