import React, { useState } from 'react';

// Types for our data structures
interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  orderDate: string;
  status: string;
}

interface QueryExample {
  category: string;
  name: string;
  query: string;
  description: string;
  explanation: string;
}

function App() {
  const [selectedQuery, setSelectedQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  // Extended sample data
  const sampleData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-02-01' },
      { id: 3, name: 'Bob Wilson', email: 'bob@example.com', joinDate: '2024-02-15' }
    ],
    products: [
      { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50 },
      { id: 2, name: 'Headphones', price: 99.99, category: 'Electronics', stock: 100 },
      { id: 3, name: 'Coffee Maker', price: 79.99, category: 'Appliances', stock: 30 },
      { id: 4, name: 'Smartphone', price: 699.99, category: 'Electronics', stock: 75 }
    ],
    orders: [
      { id: 1, userId: 1, productId: 1, quantity: 1, orderDate: '2024-02-01', status: 'completed' },
      { id: 2, userId: 2, productId: 2, quantity: 1, orderDate: '2024-02-15', status: 'completed' },
      { id: 3, userId: 1, productId: 3, quantity: 2, orderDate: '2024-03-01', status: 'pending' }
    ]
  };

  const queryExamples: QueryExample[] = [
    {
      category: 'basic',
      name: 'Select with Where Clause',
      query: 'SELECT name, price FROM products WHERE category = "Electronics";',
      description: 'Find all electronic products',
      explanation: 'The WHERE clause filters rows based on specific conditions. This query returns only products in the Electronics category.'
    },
    {
      category: 'basic',
      name: 'Order By',
      query: 'SELECT name, price FROM products ORDER BY price DESC;',
      description: 'List products by price (highest first)',
      explanation: 'ORDER BY sorts the results. DESC means descending order (highest to lowest).'
    },
    {
      category: 'joins',
      name: 'Inner Join',
      query: `
        SELECT orders.id, users.name, products.name as product_name, orders.quantity 
        FROM orders 
        INNER JOIN users ON orders.userId = users.id 
        INNER JOIN products ON orders.productId = products.id;
      `,
      description: 'Show order details with user and product information',
      explanation: 'INNER JOIN combines matching rows from multiple tables. This query connects orders with their corresponding user and product details.'
    },
    {
      category: 'aggregate',
      name: 'Group By with Having',
      query: `
        SELECT category, COUNT(*) as product_count, AVG(price) as avg_price 
        FROM products 
        GROUP BY category 
        HAVING COUNT(*) > 1;
      `,
      description: 'Calculate category statistics',
      explanation: 'GROUP BY groups rows by a column, while HAVING filters these groups. Aggregate functions like COUNT and AVG compute values for each group.'
    },
    {
      category: 'advanced',
      name: 'Subquery in WHERE',
      query: `
        SELECT name, price 
        FROM products 
        WHERE price > (SELECT AVG(price) FROM products);
      `,
      description: 'Find above-average priced products',
      explanation: 'A subquery is a query within another query. This example finds products priced higher than the average product price.'
    },
    {
      category: 'advanced',
      name: 'Window Function',
      query: `
        SELECT 
          category,
          name,
          price,
          RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank
        FROM products;
      `,
      description: 'Rank products by price within categories',
      explanation: 'Window functions perform calculations across a set of rows. This ranks products by price within each category.'
    }
  ];

  const executeQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    try {
      // Enhanced query execution logic
      if (lowerQuery.includes('from products')) {
        if (lowerQuery.includes('where category = "electronics"')) {
          setQueryResult(sampleData.products.filter(p => p.category === 'Electronics'));
        } else if (lowerQuery.includes('order by price desc')) {
          setQueryResult([...sampleData.products].sort((a, b) => b.price - a.price));
        } else if (lowerQuery.includes('group by category')) {
          const result = Object.entries(
            sampleData.products.reduce((acc, prod) => {
              if (!acc[prod.category]) {
                acc[prod.category] = { count: 0, total: 0 };
              }
              acc[prod.category].count++;
              acc[prod.category].total += prod.price;
              return acc;
            }, {} as Record<string, { count: number; total: number }>)
          ).map(([category, stats]) => ({
            category,
            product_count: stats.count,
            avg_price: (stats.total / stats.count).toFixed(2)
          }));
          setQueryResult(result);
        } else if (lowerQuery.includes('partition by')) {
          const result = sampleData.products.map(product => ({
            ...product,
            price_rank: sampleData.products
              .filter(p => p.category === product.category)
              .sort((a, b) => b.price - a.price)
              .findIndex(p => p.id === product.id) + 1
          }));
          setQueryResult(result);
        } else {
          setQueryResult(sampleData.products);
        }
      } else if (lowerQuery.includes('join')) {
        const result = sampleData.orders.map(order => ({
          id: order.id,
          user_name: sampleData.users.find(u => u.id === order.userId)?.name,
          product_name: sampleData.products.find(p => p.id === order.productId)?.name,
          quantity: order.quantity
        }));
        setQueryResult(result);
      }
    } catch (error) {
      setQueryResult([{ error: 'Query execution failed' }]);
    }
  };

  const categories = [
    { id: 'basic', name: 'Basic Queries' },
    { id: 'joins', name: 'JOINs' },
    { id: 'aggregate', name: 'Aggregations' },
    { id: 'advanced', name: 'Advanced' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Interactive SQL Learning</h1>
        
        {/* Category tabs */}
        <div className="flex space-x-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg ${
                activeCategory === category.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Query examples */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Example Queries</h2>
          <div className="space-y-4">
            {queryExamples
              .filter(example => example.category === activeCategory)
              .map((example, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{example.name}</h3>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => setShowExplanation(showExplanation === index ? null : index)}
                    >
                      {showExplanation === index ? 'Hide Info' : 'Show Info'}
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{example.description}</p>
                  {showExplanation === index && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                      {example.explanation}
                    </div>
                  )}
                  <pre className="mt-2 bg-gray-100 p-2 rounded text-sm cursor-pointer"
                       onClick={() => setSelectedQuery(example.query)}>
                    {example.query}
                  </pre>
                </div>
              ))}
          </div>
        </div>

        {/* Query input */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Execute Query</h2>
          <textarea
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            className="w-full h-32 p-2 border rounded font-mono text-sm"
            placeholder="Click on a query above or write your own..."
          />
          <button
            onClick={() => executeQuery(selectedQuery)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Execute Query
          </button>
        </div>

        {/* Query results */}
        {queryResult && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Query Results</h2>
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
      </div>
    </div>
  );
}

export default App;