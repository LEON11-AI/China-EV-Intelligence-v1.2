
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService, ModelItem } from '../src/services/ContentService';
import LazyImage from '../components/LazyImage';
import ProLocker from '../components/ProLocker';
import AuthorSignature from '../components/AuthorSignature';

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
    const [model, setModel] = useState<ModelItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchModel = async () => {
            if (!id) return;
            try {
                const foundModel = await contentService.getModelById(id);
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
                    <LazyImage src={activeImage || model.images[0]} alt={`${model.model_name} main view`} className="w-full rounded-lg shadow-lg object-cover aspect-video" />
                    <div className="flex space-x-2">
                        {model.images.map((img, index) => (
                            <div key={index} onClick={() => setActiveImage(img)} className="w-1/3 cursor-pointer">
                                <LazyImage 
                                    src={img} 
                                    alt={`${model.model_name} thumbnail ${index+1}`} 
                                    className={`h-24 object-cover rounded-md border-2 ${activeImage === img ? 'border-link-blue' : 'border-transparent'} transition-all duration-200`}
                                />
                            </div>
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

            {/* Detailed Technical Specifications - PRO Feature */}
            {model.detailed_specs && (
                <ProLocker isPro={isPro}>
                    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Detailed Technical Specifications</h2>
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                PRO
                            </span>
                        </div>
                        
                        {/* Battery Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 text-blue-400">Battery System</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Capacity:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.battery.capacity_kwh} kWh</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Chemistry:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.battery.chemistry}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Supplier:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.battery.supplier}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Voltage:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.battery.voltage}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Warranty:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.battery.warranty_years} years/{model.detailed_specs.battery.warranty_km}0k km</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Degradation Rate:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.battery.degradation_rate}</span>
                                </div>
                                {model.detailed_specs.battery.swappable && (
                                    <div className="bg-gray-800 p-3 rounded">
                                        <span className="font-medium text-gray-400">Swap Time:</span>
                                        <span className="ml-2 text-white">{model.detailed_specs.battery.swap_time_minutes} minutes</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Charging Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 text-green-400">Charging Performance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">DC Fast Charging:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.charging.dc_fast_max_kw} kW</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">10-80% Time:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.charging.dc_10_to_80_minutes} minutes</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">AC Charging:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.charging.ac_max_kw} kW</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">0-100% Time:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.charging.ac_0_to_100_hours} hours</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded col-span-2">
                                    <span className="font-medium text-gray-400">Charging Ports:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.charging.charging_ports.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 text-red-400">Performance Parameters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Top Speed:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.performance.top_speed_kmh} km/h</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">0-100km/h:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.performance.zero_to_100_kmh} seconds</span>
                                </div>
                                {model.detailed_specs.performance.zero_to_200_kmh && (
                                    <div className="bg-gray-800 p-3 rounded">
                                        <span className="font-medium text-gray-400">0-200km/h:</span>
                                        <span className="ml-2 text-white">{model.detailed_specs.performance.zero_to_200_kmh} seconds</span>
                                    </div>
                                )}
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Braking Distance:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.performance.braking_100_to_0_meters}m</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Lateral G-Force:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.performance.lateral_g_force}G</span>
                                </div>
                                {model.detailed_specs.performance.tank_turn_capable && (
                                    <div className="bg-gray-800 p-3 rounded">
                                        <span className="font-medium text-gray-400">Tank Turn:</span>
                                        <span className="ml-2 text-green-400">Supported</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Energy Efficiency Details */}
                        <div>
                            <h3 className="text-lg font-medium mb-3 text-purple-400">Energy Efficiency</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">WLTP：</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.efficiency.wltp_kwh_per_100km} kWh/100km</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">CLTC：</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.efficiency.cltc_kwh_per_100km} kWh/100km</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <span className="font-medium text-gray-400">Real World:</span>
                                    <span className="ml-2 text-white">{model.detailed_specs.efficiency.real_world_kwh_per_100km} kWh/100km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ProLocker>
            )}

            {/* Market Analysis - PRO Feature */}
            {model.market_analysis && (
                <ProLocker isPro={isPro}>
                    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Market Analysis</h2>
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                PRO
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-400 mb-2">Target Segment</h3>
                                <p className="text-white">{model.market_analysis.target_segment}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-400 mb-2">Market Position</h3>
                                <p className="text-white">{model.market_analysis.market_position}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-400 mb-2">Main Competitors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {model.market_analysis.main_competitors.map((competitor, index) => (
                                        <span key={index} className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-sm">
                                            {competitor}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-400 mb-2">Competitive Advantages</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {model.market_analysis.competitive_advantages.map((advantage, index) => (
                                        <li key={index} className="text-white text-sm">{advantage}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-400 mb-2">Estimated Annual Sales (China)</h3>
                                <p className="text-2xl font-bold text-green-400">{model.market_analysis.estimated_annual_sales_china.toLocaleString()} units</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-400 mb-2">Global Market Potential</h3>
                                <p className="text-white">{model.market_analysis.global_market_potential}</p>
                            </div>
                        </div>
                    </div>
                </ProLocker>
            )}

            {/* Competitive Comparison - PRO Feature */}
            {model.competitor_comparison && (
                <ProLocker isPro={isPro}>
                    <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Competitive Comparison</h2>
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                PRO
                            </span>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(model.competitor_comparison).map(([competitor, comparison]) => (
                                <div key={competitor} className="border border-gray-600 rounded-lg p-4">
                                    <h3 className="font-bold text-lg mb-3 text-blue-400">{competitor}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <span className="font-medium text-gray-400">Price Advantage:</span>
                                            <p className="text-white text-sm">{comparison.price_advantage}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-400">Performance:</span>
                                            <p className="text-white text-sm">{comparison.performance}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-400">Technology:</span>
                                            <p className="text-white text-sm">{comparison.tech}</p>
                                        </div>
                                        {comparison.charging && (
                                            <div>
                                                <span className="font-medium text-gray-400">Charging:</span>
                                                <p className="text-white text-sm">{comparison.charging}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ProLocker>
            )}





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

            {/* Author Signature */}
            <AuthorSignature />
        </div>
    );
};

export default ModelDetailPage;
