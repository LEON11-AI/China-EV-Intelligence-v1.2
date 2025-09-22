
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CarModel } from '../types';

interface ModelCardProps {
    model: CarModel;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => (
    <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
        <Link to={`/model/${model.id}`} className="block">
            <img src={model.images[0]} alt={`${model.brand} ${model.model_name}`} className="w-full h-48 object-cover"/>
            <div className="p-6">
                <p className="text-sm text-text-secondary">{model.brand}</p>
                <h3 className="text-2xl font-bold text-text-main mb-2">{model.model_name}</h3>
                <span className="inline-block bg-link-blue text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{model.status}</span>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-text-secondary">Range (CLTC)</p>
                        <p className="font-mono text-text-main">{model.key_specs.range_cltc}</p>
                    </div>
                    <div>
                        <p className="text-text-secondary">0-100 km/h</p>
                        <p className="font-mono text-text-main">{model.key_specs.zero_to_100}</p>
                    </div>
                    <div>
                        <p className="text-text-secondary">Power</p>
                        <p className="font-mono text-text-main">{model.key_specs.power_kw}</p>
                    </div>
                     <div>
                        <p className="text-text-secondary">Battery</p>
                        <p className="font-mono text-text-main">{model.key_specs.battery_kwh}</p>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);


const DatabasePage: React.FC = () => {
    const [models, setModels] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string>('All');
    
    const focusedBrands = ["All", "Xiaomi", "NIO", "Zeekr", "Li Auto", "XPeng", "BYD"];

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('data/models.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch models data');
                }
                const data: CarModel[] = await response.json();
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
                <p className="text-text-secondary mb-2">Filter by brand:</p>
                <div className="flex flex-wrap gap-2">
                    {focusedBrands.map(brand => (
                        <button 
                            key={brand}
                            onClick={() => setBrandFilter(brand)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
                                brandFilter === brand 
                                ? 'bg-link-blue text-white' 
                                : 'bg-dark-card text-text-secondary hover:bg-gray-600'
                            }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredModels.map(model => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        </div>
    );
};

export default DatabasePage;
