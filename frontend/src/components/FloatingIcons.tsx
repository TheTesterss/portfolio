import React from 'react';
// import { useTheme } from '../contexts/ThemeContext';

import { FaJs, FaPython, FaDiscord, FaHtml5, FaCss3Alt, FaGithub, FaGofore } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';

interface FloatingIconProps {
    IconComponent: React.ElementType;
    className: string;
    size: string;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    animationClass: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ IconComponent, className, size, position, animationClass }) => {
    return (
        <div className={`absolute ${size} ${className} ${animationClass}`} style={{ ...position, zIndex: 0 }}>
            {}
            <IconComponent className="w-full h-full" />
        </div>
    );
};

const FloatingIcons: React.FC = () => {
    // const { theme } = useTheme();

    const icons = [
        { Icon: SiTypescript, size: 'w-16 h-16', position: { top: '10%', left: '10%' }, animation: 'icon-float-1' },
        { Icon: FaGithub, size: 'w-20 h-20', position: { top: '20%', right: '15%' }, animation: 'icon-float-2' },
        { Icon: FaJs, size: 'w-14 h-14', position: { bottom: '15%', left: '20%' }, animation: 'icon-float-3' },
        { Icon: FaGofore, size: 'w-18 h-18', position: { top: '50%', left: '5%' }, animation: 'icon-float-4' },
        { Icon: FaPython, size: 'w-16 h-16', position: { bottom: '10%', right: '10%' }, animation: 'icon-float-5' },
        { Icon: FaDiscord, size: 'w-14 h-14', position: { top: '30%', left: '40%' }, animation: 'icon-float-6' },
        { Icon: FaHtml5, size: 'w-18 h-18', position: { bottom: '20%', right: '40%' }, animation: 'icon-float-7' },
        { Icon: FaCss3Alt, size: 'w-16 h-16', position: { top: '5%', right: '30%' }, animation: 'icon-float-8' }
    ];

    return (
        <>
            {icons.map((icon, index) => (
                <FloatingIcon
                    key={index}
                    IconComponent={icon.Icon}
                    // className={`${theme === 'dark' ? 'text-gray-600 opacity-20' : 'text-blue-300 opacity-30'}`}
                    className={`text-blue-300 opacity-30`}
                    size={icon.size}
                    position={icon.position}
                    animationClass={icon.animation}
                />
            ))}
        </>
    );
};

export default FloatingIcons;
