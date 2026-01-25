import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique Idempotency Key.
 * We store it in sessionStorage so if the page refreshes during 
 * a payment attempt, we can potentially reuse the same key 
 * to prevent duplicate charges.
 */
export const getIdempotencyKey = (context) => {
  const storageKey = `idempotency_${context}`;
  let key = sessionStorage.getItem(storageKey);
  
  if (!key) {
    key = uuidv4();
    sessionStorage.setItem(storageKey, key);
  }
  
  return key;
};

export const clearIdempotencyKey = (context) => {
  sessionStorage.removeItem(`idempotency_${context}`);
};