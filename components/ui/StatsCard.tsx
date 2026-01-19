'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'cyan' | 'purple' | 'gold' | 'green' | 'teal';
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyan-DEFAULT/20',
    text: 'text-cyan-DEFAULT',
    border: 'border-cyan-DEFAULT/30',
  },
  purple: {
    bg: 'bg-teal-DEFAULT/20',
    text: 'text-teal-DEFAULT',
    border: 'border-teal-DEFAULT/30',
  },
  gold: {
    bg: 'bg-gold-DEFAULT/20',
    text: 'text-gold-DEFAULT',
    border: 'border-gold-DEFAULT/30',
  },
  green: {
    bg: 'bg-teal-DEFAULT/20',
    text: 'text-teal-DEFAULT',
    border: 'border-teal-DEFAULT/30',
  },
  teal: {
    bg: 'bg-teal-DEFAULT/20',
    text: 'text-teal-DEFAULT',
    border: 'border-teal-DEFAULT/30',
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'teal',
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-xl p-5 border ${colors.border} transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend.positive
                ? 'bg-teal-DEFAULT/20 text-teal-DEFAULT'
                : 'bg-rose-DEFAULT/20 text-rose-DEFAULT'
            }`}
          >
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-3xl font-display font-bold text-teal-DEFAULT mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </motion.div>
  );
}
