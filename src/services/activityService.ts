import type { Activity, ActivityRecommendation } from '../types/activity';
import { supabase } from './supabaseClient';

type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  summary: string | null;
  activity_type: string;
  tags: string[];
  min_age: number | null;
  max_age: number | null;
  start_at: string | null;
  end_at: string | null;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  venue_name: string | null;
  city: string;
  source_name: string;
  source_url: string;
  verification_status: Activity['verificationStatus'];
  last_verified_at: string | null;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function safeSourceUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function dateLabel(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

function timeLabel(start: string | null, end: string | null): string | null {
  if (!start) return null;
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return null;
  const format = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' });
  const startText = format.format(startDate);
  if (!end) return startText;
  const endDate = new Date(end);
  return Number.isNaN(endDate.getTime()) ? startText : `${startText}–${format.format(endDate)}`;
}

async function getVerifiedActivityRows(): Promise<ActivityRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('activities')
    .select('id,title,description,summary,activity_type,tags,min_age,max_age,start_at,end_at,price_min,price_max,currency,venue_name,city,source_name,source_url,verification_status,last_verified_at')
    .eq('status', 'PUBLISHED')
    .eq('verification_status', 'VERIFIED')
    .or(`end_at.is.null,end_at.gte.${new Date().toISOString()}`)
    .order('start_at', { ascending: true, nullsFirst: false })
    .limit(24);

  if (error) throw new Error(error.message);
  return data as ActivityRow[];
}

function rowToDetail(row: ActivityRow): Activity {
  const minimumAge = row.min_age;
  const maximumAge = row.max_age;
  const priceAmount = row.price_min ?? row.price_max;
  return {
    id: row.id,
    title: escapeHtml(row.title),
    description: escapeHtml(row.description || row.summary || 'Details are available from the activity organizer.'),
    imageUrl: '/images/activity-sky.svg',
    imageAlt: 'Illustration for a family activity',
    categories: [escapeHtml(row.activity_type.replaceAll('_', ' ').toLowerCase())],
    date: row.start_at,
    time: timeLabel(row.start_at, row.end_at),
    location: row.venue_name || row.city ? {
      name: escapeHtml(row.venue_name || row.city),
      city: row.venue_name ? escapeHtml(row.city) : undefined,
    } : null,
    distanceKm: null,
    ageRange: minimumAge !== null && maximumAge !== null ? { min: minimumAge, max: maximumAge } : null,
    price: priceAmount === null ? null : { amount: Number(priceAmount), currency: row.currency },
    matchPercentage: null,
    matchReasons: [],
    source: { name: escapeHtml(row.source_name), url: safeSourceUrl(row.source_url) },
    verificationStatus: row.verification_status,
    lastVerifiedAt: row.last_verified_at,
  };
}

function rowToRecommendation(row: ActivityRow): ActivityRecommendation {
  const detail = rowToDetail(row);
  const format = [dateLabel(row.start_at), detail.location?.name].filter(Boolean).join(' · ')
    || detail.categories[0]
    || 'Family activity';
  const ageGuidance = row.min_age !== null && row.max_age !== null
    ? `Ages ${row.min_age}–${row.max_age}`
    : 'Age guidance not provided';

  return {
    id: row.id,
    title: detail.title,
    description: detail.description,
    category: detail.categories[0].toUpperCase(),
    emoji: '✦',
    visual: 'sky',
    format: escapeHtml(format),
    ageGuidance,
    reason: '',
    matchScore: null,
    sample: false,
    sourceName: escapeHtml(row.source_name),
  };
}

export async function getVerifiedActivityRecommendations(): Promise<ActivityRecommendation[]> {
  return (await getVerifiedActivityRows()).map(rowToRecommendation);
}

export async function getActivityById(id: string): Promise<Activity | null> {
  if (supabase && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    const { data, error } = await supabase
      .from('activities')
      .select('id,title,description,summary,activity_type,tags,min_age,max_age,start_at,end_at,price_min,price_max,currency,venue_name,city,source_name,source_url,verification_status,last_verified_at')
      .eq('id', id)
      .eq('status', 'PUBLISHED')
      .eq('verification_status', 'VERIFIED')
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? rowToDetail(data as ActivityRow) : null;
  }
  return null;
}
