'use client';

import { useState, useMemo } from 'react';
import { mockProperties, Property } from '@/data/properties';
import { Search, MapPin, DollarSign, Maximize2, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [acreageRange, setAcreageRange] = useState<[number, number]>([0, 30]);
  const [selectedZoning, setSelectedZoning] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [showFilters, setShowFilters] = useState(false);
  const [qozOnly, setQozOnly] = useState(false);

  const zoningTypes = useMemo(() => {
    const types = new Set(mockProperties.map(p => p.zoning));
    return ['all', ...Array.from(types).sort()];
  }, []);

  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      const matchesSearch = searchTerm === '' ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.tractId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesAcreage = property.acreage >= acreageRange[0] && property.acreage <= acreageRange[1];
      const matchesZoning = selectedZoning === 'all' || property.zoning === selectedZoning;
      const matchesDistance = property.distance <= maxDistance;
      const matchesQoz = !qozOnly || property.qozEligible;

      return matchesSearch && matchesPrice && matchesAcreage && matchesZoning && matchesDistance && matchesQoz;
    });
  }, [searchTerm, priceRange, acreageRange, selectedZoning, maxDistance, qozOnly]);

  const stats = useMemo(() => ({
    total: filteredProperties.length,
    qozEligible: filteredProperties.filter(p => p.qozEligible).length,
    avgPrice: filteredProperties.length > 0
      ? filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length
      : 0,
    totalAcreage: filteredProperties.reduce((sum, p) => sum + p.acreage, 0)
  }), [filteredProperties]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                QOZ 2.0 Investment Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">Alpharetta, GA Qualified Opportunity Zones</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-slate-400">QOZ Eligible Properties</div>
                <div className="text-xl font-bold text-emerald-400">{stats.qozEligible} of {stats.total}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Listings"
            value={stats.total.toString()}
            icon={<MapPin className="w-5 h-5" />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="QOZ Eligible"
            value={stats.qozEligible.toString()}
            icon={<CheckCircle2 className="w-5 h-5" />}
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard
            label="Avg Price"
            value={`$${(stats.avgPrice / 1000000).toFixed(1)}M`}
            icon={<DollarSign className="w-5 h-5" />}
            gradient="from-violet-500 to-purple-500"
          />
          <StatCard
            label="Total Acreage"
            value={stats.totalAcreage.toFixed(1)}
            icon={<Maximize2 className="w-5 h-5" />}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by location, tract ID, or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
                showFilters
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Price Range: ${(priceRange[0] / 1000000).toFixed(1)}M - ${(priceRange[1] / 1000000).toFixed(1)}M
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    {/* Acreage Range */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Acreage: {acreageRange[0]} - {acreageRange[1]} acres
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.5"
                        value={acreageRange[1]}
                        onChange={(e) => setAcreageRange([0, parseFloat(e.target.value)])}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Max Distance: {maxDistance} miles
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    {/* Zoning Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Zoning Type
                      </label>
                      <select
                        value={selectedZoning}
                        onChange={(e) => setSelectedZoning(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {zoningTypes.map(type => (
                          <option key={type} value={type}>
                            {type === 'all' ? 'All Zoning Types' : type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* QOZ Filter */}
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={qozOnly}
                          onChange={(e) => setQozOnly(e.target.checked)}
                          className="w-5 h-5 accent-emerald-500 rounded"
                        />
                        <span className="text-sm font-medium text-slate-300">
                          QOZ Eligible Only
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Alpharetta Area Map
                </h2>
                <MapView properties={filteredProperties} />
              </div>
            </div>
          </div>

          {/* Property Listings */}
          <div className="lg:col-span-2 space-y-4">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/50 border border-slate-700 rounded-lg">
                <XCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No properties match your filters</p>
              </div>
            ) : (
              filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={clsx("p-2 rounded-lg bg-gradient-to-br", gradient, "bg-opacity-10")}>
          <div className={clsx("bg-gradient-to-br", gradient, "bg-clip-text text-transparent")}>
            {icon}
          </div>
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}

function PropertyCard({ property, index }: { property: Property; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {property.address}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {property.qozEligible ? (
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/50 rounded-full text-xs font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              QOZ Eligible
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-400 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Not Eligible
            </span>
          )}
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/50 rounded-full text-xs font-medium text-blue-400">
            {property.source}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{property.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Price</div>
          <div className="font-semibold text-emerald-400">
            ${(property.price / 1000000).toFixed(2)}M
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Acreage</div>
          <div className="font-semibold">{property.acreage} ac</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Zoning</div>
          <div className="font-semibold text-sm">{property.zoning}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Distance</div>
          <div className="font-semibold">{property.distance} mi</div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">QOZ Tract ID</div>
        <div className="font-mono text-sm text-slate-300">{property.tractId}</div>
      </div>
    </motion.div>
  );
}

function MapView({ properties }: { properties: Property[] }) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-slate-700">
      {/* Map Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-slate-700" />
          ))}
        </div>
      </div>

      {/* Alpharetta Center Marker */}
      <div
        className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
      </div>
      <div
        className="absolute text-xs font-semibold text-yellow-400 whitespace-nowrap"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -180%)' }}
      >
        Alpharetta
      </div>

      {/* Property Markers */}
      {properties.map((property) => (
        <motion.div
          key={property.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute group"
          style={{
            left: `${property.coordinates.x}%`,
            top: `${property.coordinates.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div
            className={clsx(
              "w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150",
              property.qozEligible
                ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                : "bg-slate-500 shadow-lg shadow-slate-500/50"
            )}
          />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs whitespace-nowrap shadow-xl">
              <div className="font-semibold">{property.title}</div>
              <div className="text-slate-400">${(property.price / 1000000).toFixed(1)}M • {property.acreage} ac</div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span>QOZ Eligible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-slate-500 rounded-full" />
          <span>Not Eligible</span>
        </div>
      </div>
    </div>
  );
}
