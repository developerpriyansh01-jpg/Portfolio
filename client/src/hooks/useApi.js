import { useState, useCallback } from 'react';
import api from '../config/api';
import toast from 'react-hot-toast';

/**
 * Generic API hook with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (method, url, data = null, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const config = options.headers ? { headers: options.headers } : {};

      if (method === 'get') response = await api.get(url, config);
      else if (method === 'post') response = await api.post(url, data, config);
      else if (method === 'put') response = await api.put(url, data, config);
      else if (method === 'patch') response = await api.patch(url, data, config);
      else if (method === 'delete') response = await api.delete(url, config);

      if (options.successMessage) toast.success(options.successMessage);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      setError(message);
      if (!options.silent) toast.error(message);
      return { success: false, message, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};
