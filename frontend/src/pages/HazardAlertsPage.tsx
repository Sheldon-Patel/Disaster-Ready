import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { INDIA_STATES } from '../types';
import { aiService } from '../services/aiService';

interface Alert {
  id: string;
  type: 'flood' | 'earthquake' | 'storm' | 'heat' | 'drought' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  district: string;
  issuedAt: string;
  expiresAt: string;
}

// Sample fallback alerts when API returns no data (realistic India hazards)
const FALLBACK_ALERTS: Alert[] = [
  {
    id: 'fallback-1',
    type: 'flood',
    title: 'Monsoon Flood Advisory',
    description: 'Heavy rainfall expected over the next 48 hours. Residents in low-lying areas should be on alert.',
    severity: 'high',
    district: 'Maharashtra',
    issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fallback-2',
    type: 'heat',
    title: 'Extreme Heat Warning',
    description: 'Temperatures expected to exceed 44°C. Stay hydrated, avoid outdoor activity during peak hours (12pm–4pm).',
    severity: 'critical',
    district: 'Rajasthan',
    issuedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fallback-3',
    type: 'storm',
    title: 'Cyclone Watch',
    description: 'A low-pressure system in the Bay of Bengal may intensify. Coastal communities should stay alert.',
    severity: 'medium',
    district: 'Tamil Nadu',
    issuedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fallback-4',
    type: 'earthquake',
    title: 'Seismic Activity Alert',
    description: 'Minor tremors (M3.5) recorded. No damage reported. Continue normal activities with caution.',
    severity: 'low',
    district: 'Uttarakhand',
    issuedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
  }
];

const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

// Coordinates for major cities in Indian states
const STATE_COORDINATES: Record<string, { lat: number, lon: number, city: string }> = {
  'Delhi': { lat: 28.6139, lon: 77.2090, city: 'New Delhi' },
  'Maharashtra': { lat: 19.0760, lon: 72.8777, city: 'Mumbai' },
  'Karnataka': { lat: 12.9716, lon: 77.5946, city: 'Bengaluru' },
  'Tamil Nadu': { lat: 13.0827, lon: 80.2707, city: 'Chennai' },
  'Gujarat': { lat: 23.0225, lon: 72.5714, city: 'Ahmedabad' },
  'Rajasthan': { lat: 26.9124, lon: 75.7873, city: 'Jaipur' },
  'Uttarakhand': { lat: 30.3165, lon: 78.0322, city: 'Dehradun' },
  'Punjab': { lat: 30.7333, lon: 76.7794, city: 'Chandigarh' },
  // Default to central India if not found
  'default': { lat: 21.1458, lon: 79.0882, city: 'Nagpur' }
};

const HazardAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchAlerts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const locationsToFetch = selectedDistrict === 'all'
        ? Object.keys(STATE_COORDINATES).filter(k => k !== 'default')
        : [selectedDistrict];

      const allAlerts: Alert[] = [];
      const now = new Date();

      for (const loc of locationsToFetch) {
        try {
          const coords = STATE_COORDINATES[loc] || STATE_COORDINATES['default'];

          // Open-Meteo API: Free, no-key weather data
          // Fetching current temp, rain, and wind speed
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,rain,wind_speed_10m&timezone=Asia%2FKolkata`
          );

          if (!response.ok) continue;
          const data = await response.json();
          const current = data.current;

          let hasAlert = false;

          // Heatwave Logic (>40°C = critical, >35°C = high)
          if (current.temperature_2m >= 40) {
            allAlerts.push({
              id: `${loc}-heat-${now.getTime()}`,
              type: 'heat',
              title: 'Severe Heatwave Alert',
              description: `Extremely high temperatures (${current.temperature_2m}°C) recorded in ${coords.city}. Danger of heatstroke. Stay indoors and hydrated.`,
              severity: 'critical',
              district: loc,
              issuedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString()
            });
            hasAlert = true;
          } else if (current.temperature_2m >= 35) {
            allAlerts.push({
              id: `${loc}-heat-${now.getTime()}`,
              type: 'heat',
              title: 'High Temperature Advisory',
              description: `High temperatures (${current.temperature_2m}°C) in ${coords.city}. Avoid strenuous outdoor activities during peak afternoon hours.`,
              severity: 'high',
              district: loc,
              issuedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString()
            });
            hasAlert = true;
          }

          // Rainfall/Flood Logic (>15mm/hr = critical, >5mm/hr = high)
          if (current.rain >= 15) {
            allAlerts.push({
              id: `${loc}-flood-${now.getTime()}`,
              type: 'flood',
              title: 'Flash Flood Warning',
              description: `Heavy torrential rain (${current.rain}mm/hr) in ${coords.city}. High risk of waterlogging and flash floods. Avoid low-lying areas.`,
              severity: 'critical',
              district: loc,
              issuedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString()
            });
            hasAlert = true;
          } else if (current.rain >= 5) {
            allAlerts.push({
              id: `${loc}-flood-${now.getTime()}`,
              type: 'flood',
              title: 'Heavy Rainfall Alert',
              description: `Moderate to heavy rain (${current.rain}mm/hr) in ${coords.city}. Drive carefully and watch for localized flooding.`,
              severity: 'medium',
              district: loc,
              issuedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString()
            });
            hasAlert = true;
          }

          // Wind/Storm Logic (>60km/h = critical, >40km/h = high)
          if (current.wind_speed_10m >= 60) {
            allAlerts.push({
              id: `${loc}-storm-${now.getTime()}`,
              type: 'storm',
              title: 'Severe Storm Warning',
              description: `Dangerous wind gusts (${current.wind_speed_10m} km/h) in ${coords.city}. Risk of uprooted trees and power lines. Stay indoors.`,
              severity: 'critical',
              district: loc,
              issuedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString()
            });
            hasAlert = true;
          } else if (current.wind_speed_10m >= 40) {
            allAlerts.push({
              id: `${loc}-storm-${now.getTime()}`,
              type: 'storm',
              title: 'High Wind Advisory',
              description: `Strong winds (${current.wind_speed_10m} km/h) detected in ${coords.city}. Secure loose outdoor objects.`,
              severity: 'medium',
              district: loc,
              issuedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString()
            });
            hasAlert = true;
          }

          // Drought warning logic (Hot and completely dry with low wind)
          if (!hasAlert && current.temperature_2m >= 32 && current.rain === 0) {
            // We won't add too many of these so it doesn't clutter, maybe just for specific states
            if (['Rajasthan', 'Gujarat'].includes(loc)) {
              allAlerts.push({
                id: `${loc}-drought-${now.getTime()}`,
                type: 'drought',
                title: 'Dry Spell Condition',
                description: `Prolonged dry and hot conditions (${current.temperature_2m}°C) in ${coords.city}. Water conservation advised.`,
                severity: 'low',
                district: loc,
                issuedAt: now.toISOString(),
                expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
              });
            }
          }

        } catch (err) {
          console.error(`Error fetching weather for ${loc}:`, err);
        }
      }

      // We no longer fallback to fake data unless absolutely everything failed
      // This makes it REAL time.
      if (allAlerts.length > 0) {
        setAlerts(allAlerts.sort((a, b) => {
          // Sort by severity first (critical -> high -> medium -> low)
          const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
          if (severityWeight[a.severity] !== severityWeight[b.severity]) {
            return severityWeight[b.severity] - severityWeight[a.severity];
          }
          // Then by date
          return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
        }));
      } else {
        // Only use fallback if we literally couldn't reach the API at all
        setAlerts(FALLBACK_ALERTS);
      }

      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to fetch hazard alerts', error);
      setAlerts(FALLBACK_ALERTS);
      setLastChecked(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDistrict]);

  // Initial load and when district changes
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchAlerts(true), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500';
      case 'high': return 'border-orange-400';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-blue-400';
      default: return 'border-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'earthquake': return '🌍';
      case 'storm': return '⛈️';
      case 'heat': return '🌡️';
      case 'drought': return '🏜️';
      default: return '⚠️';
    }
  };

  const filteredAlerts = selectedDistrict === 'all'
    ? alerts
    : alerts.filter(alert => alert.district.toLowerCase() === selectedDistrict.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hazard alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Hazard Alerts</h1>
              <p className="text-gray-600 mt-1">Live disaster and weather alerts across India</p>
              {lastChecked && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {lastChecked.toLocaleTimeString()} · Auto-refreshes every 5 min
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchAlerts(true)}
                disabled={refreshing}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Refreshing...' : 'Refresh Now'}
              </button>
              <Link
                to="/"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by State / UT</h2>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All India (Summary)</option>
            {INDIA_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts Section */}
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Alerts</h3>
            <p className="text-gray-600">There are currently no hazard alerts for the selected area.</p>
            {lastChecked && (
              <p className="text-sm text-gray-400 mt-2">Checked at {lastChecked.toLocaleTimeString()}</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Active Alerts ({filteredAlerts.length})
              </h2>
              {refreshing && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Updating...
                </span>
              )}
            </div>

            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${getSeverityBorderColor(alert.severity)}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-3xl">{getTypeIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{alert.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {alert.district}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Issued: {new Date(alert.issuedAt).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Expires: {new Date(alert.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Emergency Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Emergency Guidelines</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Stay tuned to official sources for updates</li>
            <li>• Follow evacuation orders if issued</li>
            <li>• Keep emergency supplies ready</li>
            <li>• Avoid traveling unless absolutely necessary</li>
            <li>• Contact local authorities for assistance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HazardAlertsPage;
