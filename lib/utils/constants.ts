import {headers} from 'next/headers'

export const ZOD_VALIDATION_ERROR = "ZOD_VALIDATION_ERROR";
export const SITE_NAME = "TrendyWApp";
export const SITE_BASE_URL = `${headers().get('x-forwarded-proto')}://${headers().get('host')}` || "https://whatsapp-chat-trends.vercel.app";
