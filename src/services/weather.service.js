const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 5000;

const cache = new Map();

const WEATHER_CONDITIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const toNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const getCacheKey = (latitude, longitude) => (
  `${Number(latitude).toFixed(4)},${Number(longitude).toFixed(4)}`
);

const getCacheTtlMs = () => {
  const seconds = Number(process.env.WEATHER_CACHE_TTL_SECONDS || 900);
  return Number.isFinite(seconds) && seconds > 0
    ? seconds * 1000
    : DEFAULT_CACHE_TTL_MS;
};

const getTimeoutMs = () => {
  const timeoutMs = Number(process.env.WEATHER_API_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;
};

class WeatherService {
  async getCurrentByCoordinates(latitude, longitude) {
    const lat = toNumber(latitude);
    const lon = toNumber(longitude);

    if (lat === null || lon === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Location coordinates are required');
    }

    const cacheKey = getCacheKey(lat, lon);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return {
        ...cached.data,
        cached: true,
      };
    }

    const data = await this.fetchOpenMeteo(lat, lon);
    cache.set(cacheKey, {
      data,
      expiresAt: Date.now() + getCacheTtlMs(),
    });

    return {
      ...data,
      cached: false,
    };
  }

  async fetchOpenMeteo(latitude, longitude) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
      ].join(','),
      timezone: 'Asia/Bangkok',
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

    try {
      const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Weather provider request failed', {
          provider: 'open-meteo',
          status: response.status,
        });
      }

      const payload = await response.json();
      return this.mapOpenMeteoResponse(payload, latitude, longitude);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Weather provider request timed out', {
          provider: 'open-meteo',
        });
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  mapOpenMeteoResponse(payload, latitude, longitude) {
    const current = payload.current || {};
    const weatherCode = current.weather_code ?? null;

    return {
      provider: 'open-meteo',
      latitude,
      longitude,
      timezone: payload.timezone || 'Asia/Bangkok',
      temperature: current.temperature_2m ?? null,
      feels_like: current.apparent_temperature ?? null,
      humidity: current.relative_humidity_2m ?? null,
      precipitation: current.precipitation ?? null,
      wind_speed: current.wind_speed_10m ?? null,
      weather_code: weatherCode,
      condition: WEATHER_CONDITIONS[weatherCode] || 'Unknown',
      units: {
        temperature: payload.current_units?.temperature_2m || '°C',
        feels_like: payload.current_units?.apparent_temperature || '°C',
        humidity: payload.current_units?.relative_humidity_2m || '%',
        precipitation: payload.current_units?.precipitation || 'mm',
        wind_speed: payload.current_units?.wind_speed_10m || 'km/h',
      },
      updated_at: current.time || new Date().toISOString(),
    };
  }
}

module.exports = new WeatherService();
