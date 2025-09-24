
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { contentService, ModelItem } from '../src/services/ContentService';
import LazyImage from '../components/LazyImage';

interface ModelCardProps {
    model: ModelItem;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => (
    <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out active:scale-95 touch-manipulation">
        <Link to={`/model/${model.id}`} className="block">
            <LazyImage src={model.images[0]} alt={`${model.brand} ${model.model_name}`} className="w-full h-48 sm:h-56 object-cover"/>
            <div className="p-4 sm:p-6">
                <p className="text-sm text-text-secondary">{model.brand}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-2 line-clamp-2">{model.model_name}</h3>
                <span className="inline-block bg-link-blue text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{model.status}</span>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="min-w-0">
                        <p className="text-text-secondary truncate">Range (CLTC)</p>
                        <p className="font-mono text-text-main font-semibold">{model.key_specs.range_cltc}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-text-secondary truncate">0-100 km/h</p>
                        <p className="font-mono text-text-main font-semibold">{model.key_specs.zero_to_100}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-text-secondary truncate">Power</p>
                        <p className="font-mono text-text-main font-semibold">{model.key_specs.power_kw}</p>
                    </div>
                     <div className="min-w-0">
                        <p className="text-text-secondary truncate">Battery</p>
                        <p className="font-mono text-text-main font-semibold">{model.key_specs.battery_kwh}</p>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);


const DatabasePage: React.FC = () => {
    const [models, setModels] = useState<ModelItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string>('All');
    
    const focusedBrands = ["All", "Xiaomi", "NIO", "Zeekr", "Li Auto", "XPeng", "BYD"];

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const data = await contentService.getModels();
                setModels(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    const filteredModels = useMemo(() => {
        if (brandFilter === 'All') {
            return models;
        }
        return models.filter(model => model.brand === brandFilter);
    }, [models, brandFilter]);

    if (loading) return <div className="text-center">Loading database...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Focused EV Model Database</h1>
            <div className="bg-blue-900/20 border border-link-blue text-blue-200 px-4 py-3 rounded-lg relative mb-8" role="alert">
                <strong className="font-bold">Our Data Collection Principle: </strong>
                <span className="block sm:inline">We focus on a curated list of high-impact models to provide depth over breadth. This ensures the highest quality of data and analysis.</span>
            </div>
            
            <div className="mb-8">
                <p className="text-text-secondary mb-3 text-sm sm:text-base">Filter by brand:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {focusedBrands.map(brand => (
                        <button 
                            key={brand}
                            onClick={() => setBrandFilter(brand)}
                            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out touch-manipulation active:scale-95 ${
                                brandFilter === brand 
                                ? 'bg-link-blue text-white shadow-lg' 
                                : 'bg-dark-card text-text-secondary hover:bg-gray-600 hover:text-white'
                            }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredModels.map(model => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        </div>
    );
};

export default DatabasePage;
