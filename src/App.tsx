import React, { useState } from 'react';
import SQLVisualBuilder from './components/SQLVisualBuilder'

interface QueryExample {
  name: string;
  query: string;
  description: string;
}

function App() {
  const [selectedQuery, setSelectedQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  // Sample data to simulate a database
  const sampleData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    products: [
      { id: 1, name: 'Laptop', price: 999.99 },
      { id: 2, name: 'Headphones', price: 99.99 }
    ]
  };

  const queryExamples: QueryExample[] = [
    {
      name: 'Select All Users',
      query: 'SELECT * FROM users',
      description: 'Retrieves all user records'
    },
    {
      name: 'Select Expensive Products',
      query: 'SELECT * FROM products WHERE price > 500',
      description: 'Finds products with price over $500'
    }
  ];

  const executeQuery = (query: string) => {
    // Simple query executor for demonstration
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('from users')) {
      setQueryResult(sampleData.users);
    } 
    else if (lowerQuery.includes('from products')) {
      if (lowerQuery.includes('price > 500')) {
        setQueryResult(sampleData.products.filter(p => p.price > 500));
      } else {
        setQueryResult(sampleData.products);
      }
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">
      <div>
      <SQLVisualBuilder />
      </div>
      {/* <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SQL Query Demonstration</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Example Queries</h2>
          <div className="space-y-4">
            {queryExamples.map((example, index) => (
              <div 
                key={index}
                className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedQuery(example.query)}
              >
                <h3 className="font-medium">{example.name}</h3>
                <p className="text-gray-600 text-sm">{example.description}</p>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-sm">
                  {example.query}
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Query</h2>
          <textarea
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            className="w-full h-32 p-2 border rounded font-mono text-sm"
            placeholder="Write or select a SQL query..."
          />
          <button
            onClick={() => executeQuery(selectedQuery)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Execute Query
          </button>
        </div>

        {queryResult && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Query Result</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    {Object.keys(queryResult[0] || {}).map(key => (
                      <th key={key} className="border p-2 bg-gray-50 text-left">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="border p-2">
                          {value?.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default App;