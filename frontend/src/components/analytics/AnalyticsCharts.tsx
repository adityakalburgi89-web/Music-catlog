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
} from 'recharts';
import { Library, Disc, Star, Music } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: AnalyticsResponse;
}

const CLAY_COLORS = ['#ff4d8b', '#1a3a3a', '#b8a4ed', '#ffb084', '#e8b94a', '#a4d4c5', '#ff6b5a'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics }) => {
  // Convert genre map to array
  const genreData = Object.entries(analytics.albumsByGenre || {}).map(([genre, count]) => ({
    genre,
    count,
  }));

  // Convert release year map to array
  const yearData = Object.entries(analytics.releasesByYear || {}).map(([year, count]) => ({
    year: `${year}`,
    count,
  }));

  // Convert rating distribution map to array
  const ratingData = Object.entries(analytics.ratingDistribution || {}).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count,
  }));

  // Convert track count distribution map to array
  const trackData = Object.entries(analytics.trackCountDistribution || {}).map(([range, count]) => ({
    range,
    count,
  }));

  // Convert track count distribution map to array

  return (
    <div className="space-y-8">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-brand-pink/10 border border-brand-pink/30 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-brand-pink text-white shadow-sm">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Saved Albums</p>
            <h4 className="font-display text-3xl font-medium text-ink">{analytics.totalAlbums}</h4>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-brand-teal text-white shadow-sm">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Avg Track Count</p>
            <h4 className="font-display text-3xl font-medium text-ink">{analytics.averageTrackCount}</h4>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-brand-ochre/10 border border-brand-ochre/30 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-brand-ochre text-ink shadow-sm">
            <Star className="w-6 h-6 fill-ink" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Average Rating</p>
            <h4 className="font-display text-3xl font-medium text-ink">
              {analytics.averageRating > 0 ? `${analytics.averageRating} / 5` : 'N/A'}
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-brand-lavender/20 border border-brand-lavender flex items-center gap-4">
          <div className="p-3 rounded-lg bg-brand-lavender text-ink shadow-sm">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Unique Genres</p>
            <h4 className="font-display text-3xl font-medium text-ink">{genreData.length}</h4>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Breakdown Pie Chart */}
        <div className="p-6 rounded-xl bg-surface-card border border-hairline shadow-sm">
          <h3 className="font-display font-medium text-lg text-ink mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
            Albums by Genre
          </h3>
          {genreData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    dataKey="count"
                    nameKey="genre"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={4}
                    label={({ genre, count }) => `${genre} (${count})`}
                  >
                    {genreData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CLAY_COLORS[index % CLAY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fffaf0', borderColor: '#e5e5e5', borderRadius: '12px' }}
                    itemStyle={{ color: '#0a0a0a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted text-sm italic">
              No genre data recorded in database.
            </div>
          )}
        </div>

        {/* Releases by Year Bar Chart */}
        <div className="p-6 rounded-xl bg-surface-card border border-hairline shadow-sm">
          <h3 className="font-display font-medium text-lg text-ink mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
            Releases by Year
          </h3>
          {yearData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData}>
                  <XAxis dataKey="year" stroke="#6a6a6a" />
                  <YAxis allowDecimals={false} stroke="#6a6a6a" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fffaf0', borderColor: '#e5e5e5', borderRadius: '12px' }}
                    itemStyle={{ color: '#1a3a3a' }}
                  />
                  <Bar dataKey="count" fill="#1a3a3a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted text-sm italic">
              No release year data recorded.
            </div>
          )}
        </div>

        {/* Rating Spread Chart */}
        <div className="p-6 rounded-xl bg-surface-card border border-hairline shadow-sm">
          <h3 className="font-display font-medium text-lg text-ink mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-ochre" />
            Rating Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical">
                <XAxis type="number" allowDecimals={false} stroke="#6a6a6a" />
                <YAxis dataKey="rating" type="category" stroke="#6a6a6a" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fffaf0', borderColor: '#e5e5e5', borderRadius: '12px' }}
                  itemStyle={{ color: '#0a0a0a' }}
                />
                <Bar dataKey="count" fill="#e8b94a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Track Count Distribution */}
        <div className="p-6 rounded-xl bg-surface-card border border-hairline shadow-sm">
          <h3 className="font-display font-medium text-lg text-ink mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-peach" />
            Track Count Spread
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackData}>
                <XAxis dataKey="range" stroke="#6a6a6a" />
                <YAxis allowDecimals={false} stroke="#6a6a6a" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fffaf0', borderColor: '#e5e5e5', borderRadius: '12px' }}
                  itemStyle={{ color: '#0a0a0a' }}
                />
                <Bar dataKey="count" fill="#ffb084" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
