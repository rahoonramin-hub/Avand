import { images } from "./images";

export const colors = {
  sky: '#485CA4',
  yellow: '#FCC305',
  pink: '#FF2D47',
  orange: '#F63E02',
  green: '#00CC66',
  purple: '#D90368',
  red: '#FF0000',  
  
  hardness: {
    easy: {
      fill: '#10b98122',
      border: '#10b981',
    },
    medium: {
      fill: '#3b82f622',
      border: '#3b82f6',
    },
    hard: {
      fill: '#f59e0b22',
      border: '#f59e0b',
    },
    veteran: {
      fill: '#ef444422',
      border: '#ef4444',
    },
    hell: {
      fill: '#dc262622',
      border: '#dc2626',
    },
  },
  
  dark: {
    txt: '#F4E8C1',
    txt2: '#8b90b8',
    bg: '#090E11',
    surface2: '#1B2A3C',
    surface: '#121D28',
    border:   '#2a2d3a',
  },

}
export const SET_PALETTE = [
  {
    bg: colors.hardness.easy.fill,
    accent: colors.hardness.easy.border,
    border: '#0B6B43',
    icon: images.leaf,
    glow: 'rgba(16, 185, 129, 0.08)',
  },
  {
    bg: colors.hardness.medium.fill,
    accent: colors.hardness.medium.border,
    border: '#245A9C',
    icon: images.drop,
    glow: 'rgba(59, 130, 246, 0.08)',
  },
  {
    bg: colors.hardness.hard.fill,
    accent: colors.hardness.hard.border,
    border: '#A16207',
    icon: images.fire,
    glow: 'rgba(245, 158, 11, 0.08)',
  },
  {
    bg: colors.hardness.hell.fill,
    accent: colors.hardness.hell.border,
    border: '#991B1B',
    icon: images.baloon,
    glow: 'rgba(220, 38, 38, 0.08)',
  },
  {
    bg: colors.hardness.veteran.fill,
    accent: colors.hardness.veteran.border,
    border: '#7F1D1D',
    icon: images.dinamit,
    glow: 'rgba(239, 68, 68, 0.08)',
  },
];