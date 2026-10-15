// Le frontend et les routes /api font partie de la même application Next.js :
// les appels restent sur la même origine (localhost en local, le domaine du site en production).
// Pointer vers une autre origine (ex. la production depuis localhost) est bloqué par le navigateur (CORS).
export const API_URL = '';
