
import React from 'react';




const BrandLogos = () => {
    const brands = [
        { name: 'NIO', logo: '/images/logo-nio.png' },
        { name: 'Xiaomi', logo: '/images/logo-xiaomi.png' },
        { name: 'Zeekr', logo: '/images/logo-zeekr.png' },
        { name: 'Li Auto', logo: '/images/logo-li-auto.png' },
        { name: 'XPeng', logo: '/images/logo-xpeng.png' },
        { name: 'BYD', logo: '/images/logo-byd.png' },
    ];
    return (
         <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {brands.map((brand) => (
                <div key={brand.name} className="flex items-center justify-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110">
                    <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`} 
                        className="h-8 w-auto object-contain transition-transform duration-300 hover:scale-125"
                        onLoad={() => console.log(`${brand.name} logo loaded successfully`)}
                        onError={(e) => {
                            console.error(`Failed to load ${brand.name} logo:`, brand.logo);
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default BrandLogos;
