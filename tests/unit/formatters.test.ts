import { formatDate, formatDuration, getScoreBadgeClass, getDifficultyBadgeClass } from '@/lib/utils/formatters';

describe('Formatters Utility Suite', () => {
  test('formatDuration formats seconds properly', () => {
    expect(formatDuration(0)).toBe('0m 0s');
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(125)).toBe('2m 5s');
    expect(formatDuration(3600)).toBe('60m 0s');
  });

  test('getScoreBadgeClass returns correct CSS classes based on score', () => {
    expect(getScoreBadgeClass(95)).toContain('text-emerald-700');
    expect(getScoreBadgeClass(70)).toContain('text-amber-700');
    expect(getScoreBadgeClass(45)).toContain('text-rose-700');
    expect(getScoreBadgeClass(undefined)).toContain('text-slate-700');
  });

  test('getDifficultyBadgeClass returns correct CSS classes', () => {
    expect(getDifficultyBadgeClass('Easy')).toContain('text-green-800');
    expect(getDifficultyBadgeClass('Medium')).toContain('text-amber-800');
    expect(getDifficultyBadgeClass('Hard')).toContain('text-rose-800');
  });

  test('formatDate handles valid and invalid strings', () => {
    expect(formatDate(undefined)).toBe('N/A');
    const iso = '2026-10-02T10:00:00.000Z';
    expect(formatDate(iso)).toBeTruthy();
  });
});
