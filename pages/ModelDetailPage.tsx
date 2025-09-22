
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CarModel } from '../types';
import ProLocker from '../components/ProLocker';

interface ModelDetailPageProps {
    isPro: boolean;
}

const SpecItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-text-secondary">{label}</dt>
        <dd className="mt-1 text-sm text-text-main sm:mt-0 sm:col-span-2 font-mono">{value}</dd>
    </div>
);

const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ isPro }) => {
    const { id } = useParams<{ id: string }>();
    const [model, setModel] = useState<CarModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchModel = async () => {
            if (!id) return;
            try {
                const response = await fetch('/data/models.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch models data');
                }
                const data: CarModel[] = await response.json();
                const foundModel = data.find(m => m.id === id);
                if (foundModel) {
                    setModel(foundModel);
                    setActiveImage(foundModel.images[0]);
                } else {
                    setError('Model not found');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModel();
    }, [id]);

    if (loading) return <div className="text-center">Loading model details...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;
    if (!model) return <div className="text-center">No model data available.</div>;

    const ceoNoteTeaser = model.ceo_note.split('. ').slice(0, 1).join('. ') + '.';

    return (
        <div className="space-y-12">
            <div>
                <Link to="/database" className="text-link-blue hover:text-link-hover">&larr; Back to Database</Link>
                <h1 className="text-5xl font-bold mt-2">{model.brand} {model.model_name}</h1>
                <p className="text-xl text-text-secondary mt-1">{model.status}</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-4">
                    <img src={activeImage || model.images[0]} alt={`${model.model_name} main view`} className="w-full rounded-lg shadow-lg object-cover aspect-video" />
                    <div className="flex space-x-2">
                        {model.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`${model.model_name} thumbnail ${index+1}`} 
                                onClick={() => setActiveImage(img)}
                                className={`w-1/3 h-24 object-cover rounded-md cursor-pointer border-2 ${activeImage === img ? 'border-link-blue' : 'border-transparent'} transition-all duration-200`}
                            />
                        ))}
                    </div>
                </div>
                 <div className="lg:col-span-2 bg-dark-card p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">Key Specifications</h2>
                     <div className="space-y-4">
                        <SpecItem label="Range (CLTC)" value={model.key_specs.range_cltc} />
                        <SpecItem label="0-100 km/h" value={model.key_specs.zero_to_100} />
                        <SpecItem label="Power" value={model.key_specs.power_kw} />
                        <SpecItem label="Battery" value={model.key_specs.battery_kwh} />
                        <SpecItem label="Est. Price (USD)" value={`$${model.price_usd_estimated[0].toLocaleString()} - $${model.price_usd_estimated[1].toLocaleString()}`} />
                    </div>
                </div>
            </div>

             <div className="bg-dark-card p-8 rounded-lg shadow-lg border-l-4 border-cta-orange">
                <h2 className="text-2xl font-bold text-cta-orange mb-4">Chief Experience Officer Note</h2>
                {!isPro ? (
                     <div className="relative">
                        <p className="text-text-secondary italic">
                           {ceoNoteTeaser}
                        </p>
                        <div className="mt-4">
                           <Link to="/pricing">
                            <button className="bg-cta-orange text-white font-bold py-2 px-5 rounded-md hover:bg-cta-hover transition-colors duration-300 text-sm">
                                Read Full Note with Pro
                            </button>
                           </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-text-secondary italic text-lg">{model.ceo_note}</p>
                        <div className="mt-4 text-right">
                           <p className="font-bold text-sm text-text-main">Jane Doe</p>
                           <p className="text-xs text-text-secondary">Founder, China EV Intelligence</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <ProLocker isPro={isPro}>
                    <div className="bg-dark-card p-6 rounded-lg shadow-lg h-full">
                        <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">Full Specifications</h2>
                        <dl className="divide-y divide-gray-700">
                            <SpecItem label="Dimensions (LWH)" value={model.full_specs.dimensions} />
                            <SpecItem label="Wheelbase" value={model.full_specs.wheelbase} />
                            <SpecItem label="Powertrain" value={model.full_specs.powertrain} />
                            <SpecItem label="Battery" value={model.full_specs.battery} />
                            <SpecItem label="Charging" value={model.full_specs.charging} />
                            <SpecItem label="ADAS" value={model.full_specs.adas} />
                        </dl>
                    </div>
                </ProLocker>
                 <ProLocker isPro={isPro}>
                    <div className="bg-dark-card p-6 rounded-lg shadow-lg h-full">
                        <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">Market Plan & Sources</h2>
                        <dl className="divide-y divide-gray-700">
                            <SpecItem label="China Launch" value={model.market_plan.china_launch} />
                            <SpecItem label="Global Rollout" value={model.market_plan.global_rollout} />
                        </dl>
                        <h3 className="font-bold mt-6 mb-2">Sources:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary">
                            {model.sources.map((source, index) => (
                                <li key={index}>{source.date}: {source.type} (Confidence: {source.confidence})</li>
                            ))}
                        </ul>
                    </div>
                </ProLocker>
            </div>
        </div>
    );
};

export default ModelDetailPage;
