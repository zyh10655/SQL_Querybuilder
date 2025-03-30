// src/hooks/useSQLDemo.ts
import { useState, useCallback } from 'react';

interface SQLResult {
  columns: string[];
  rows: any[];
}

export const useSQLDemo = () => {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SQLResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const executeQuery = useCallback((sqlQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate SQL execution
      const mockResult = simulateQuery(sqlQuery);
      setResult(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    query,
    setQuery,
    result,
    error,
    loading,
    executeQuery
  };
};

// Mock function to simulate SQL execution
const simulateQuery = (query: string): SQLResult => {
  // Simple query parser for demonstration
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('select') && queryLower.includes('from users')) {
    return {
      columns: ['id', 'name', 'email', 'joinDate'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-02-01' }
      ]
    };
  }
  
  throw new Error('Query not supported in demo');
};