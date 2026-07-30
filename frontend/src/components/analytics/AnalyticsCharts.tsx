import React from 'react';
import { AnalyticsResponse } from '../../types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Library, Disc, Star, Music } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: AnalyticsResponse;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics }) => {
  return (
    <div className="space-y-8">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Saved Albums</p>
            <h4 className="text-2xl font-extrabold text-slate-100">{analytics.totalSavedAlbums}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tracks</p>
            <h4 className="text-2xl font-extrabold text-slate-100">{analytics.totalTracks}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Track Count</p>
            <h4 className="text-2xl font-extrabold text-slate-100">{analytics.averageTrackCount}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Rating</p>
            <h4 className="text-2xl font-extrabold text-amber-300">
              {analytics.averageRating > 0 ? `${analytics.averageRating} / 5` : 'N/A'}
            </h4>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Breakdown Pie Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Genre Breakdown
          </h3>
          {analytics.genreDistribution.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.genreDistribution}
                    dataKey="count"
                    nameKey="genre"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={4}
                    label={({ genre, percentage }) => `${genre} (${percentage}%)`}
                  >
                    {analytics.genreDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500 text-sm">
              No genre data available in local database.
            </div>
          )}
        </div>

        {/* Release Decade Distribution Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Releases by Decade
          </h3>
          {analytics.releaseDecadeDistribution.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.releaseDecadeDistribution}>
                  <XAxis dataKey="decade" stroke="#64748b" />
                  <YAxis allowDecimals={false} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500 text-sm">
              No decade data available.
            </div>
          )}
        </div>

        {/* Rating Spread Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            User Ratings Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.ratingDistribution} layout="vertical">
                <XAxis type="number" allowDecimals={false} stroke="#64748b" />
                <YAxis dataKey="rating" type="category" tickFormatter={(r) => `${r} Stars`} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Bar dataKey="count" fill="#fbbf24" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Artists in Library */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Most Collected Artists
            </h3>
            <div className="space-y-3">
              {analytics.topArtists.map((artist, idx) => (
                <div
                  key={artist.artist}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-sm text-slate-200">{artist.artist}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                    {artist.albumCount} {artist.albumCount === 1 ? 'Album' : 'Albums'}
                  </span>
                </div>
              ))}
              {analytics.topArtists.length === 0 && (
                <p className="text-sm text-slate-500 italic">No artist data compiled yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
