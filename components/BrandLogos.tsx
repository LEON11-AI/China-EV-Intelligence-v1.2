
import React from 'react';




const BrandLogos = () => {
    const brands = [
        { name: 'NIO', logo: '/images/logo-nio.png' },
        { name: 'Xiaomi', logo: '/images/logo-xiaomi.png' },
        { name: 'Zeekr', logo: '/images/logo-zeekr.png' },
        { name: 'Li Auto', logo: '/images/logo-li-auto.png' },
        { name: 'XPeng', logo: '/images/logo-xpeng.png' },
        { name: 'BYD', logo: '/images/logo-byd.png' },
        { name: 'AITO', logo: null }, // No logo available
    ];
    return (
         <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {brands.map((brand) => (
                <div key={brand.name} className="flex items-center justify-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    {brand.logo ? (
                        <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`} 
                            className="h-8 w-auto object-contain filter brightness-0 invert"
                        />
                    ) : (
                        <span className="text-lg font-bold text-gray-300">{brand.name}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BrandLogos;
