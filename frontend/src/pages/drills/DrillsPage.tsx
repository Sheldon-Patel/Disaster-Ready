import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drillScenarios = [
  {
    id: 'earthquake',
    title: 'Earthquake Evacuation',
    description: 'Navigate the 3D school building and follow the safest evacuation route during a simulated earthquake event.',
    icon: '🌍',
    difficulty: 'Intermediate',
    difficultyColor: 'bg-yellow-100 text-yellow-800',
    gradient: 'from-amber-500 to-orange-600',
    tips: ['Drop, cover, hold on', 'Avoid windows & doors', 'Head to the assembly point'],
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    description: 'React to a fire in the building — find the fire exits, avoid smoke corridors, and get everyone out safely.',
    icon: '🔥',
    difficulty: 'Beginner',
    difficultyColor: 'bg-green-100 text-green-800',
    gradient: 'from-red-500 to-rose-700',
    tips: ['Stay low under smoke', 'Use stairways, not lifts', 'Alert others as you exit'],
  },
  {
    id: 'flood',
    title: 'Flood Evacuation',
    description: 'Navigate rising water levels inside the building and guide your team to higher ground using the 3D map.',
    icon: '🌊',
    difficulty: 'Advanced',
    difficultyColor: 'bg-red-100 text-red-800',
    gradient: 'from-blue-500 to-indigo-700',
    tips: ['Move to upper floors first', 'Avoid electrical areas', 'Stay away from drains'],
  },
];

const DrillsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/40 rounded-full px-4 py-1 mb-6 text-sm font-medium text-red-200">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            Interactive 3D Simulation
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Virtual Emergency Drills
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Step inside a fully interactive 3D school building. Choose a disaster scenario and
            practice the correct evacuation route — just like the real thing.
          </p>
          <Link
            to="/drills/evacuation-3d"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl transition-all hover:scale-105"
          >
            <span className="text-2xl">🏫</span>
            Launch 3D Drill Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── How It Works ─────────────────────────────────────── */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: '🏚️', title: 'Pick a Scenario', desc: 'Choose from Earthquake, Fire, or Flood and read the safety tips.' },
              { step: '2', icon: '🖱️', title: 'Enter the 3D Building', desc: 'Navigate through a realistic school floor plan inside the browser.' },
              { step: '3', icon: '✅', title: 'Complete the Drill', desc: 'Follow the route correctly and earn your drill completion badge.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg mb-4">
                  {step}
                </div>
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scenario Cards ───────────────────────────────────── */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Drill Scenario</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {drillScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Card header */}
              <div className={`bg-gradient-to-r ${scenario.gradient} p-6 flex flex-col items-center text-white`}>
                <span className="text-5xl mb-3 drop-shadow-lg">{scenario.icon}</span>
                <h3 className="text-xl font-bold">{scenario.title}</h3>
                <span className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/20`}>
                  {scenario.difficulty}
                </span>
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">{scenario.description}</p>

                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Key Tips</p>
                  <ul className="space-y-1.5">
                    {scenario.tips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link
                    to="/drills/evacuation-3d"
                    className={`block w-full text-center bg-gradient-to-r ${scenario.gradient} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow`}
                  >
                    Start This Drill →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Completion reminder ──────────────────────────────── */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🏅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Complete All 3 Drills</h3>
          <p className="text-gray-600 max-w-lg mx-auto text-sm">
            Finish all three disaster scenarios in the 3D simulation to unlock the
            <span className="font-semibold text-red-600"> Prepared Student badge</span>.
            Regular drill practice can save lives in a real emergency.
          </p>
          <Link
            to="/drills/evacuation-3d"
            className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow transition-all hover:scale-105"
          >
            Open 3D Drill Simulator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DrillsPage;
