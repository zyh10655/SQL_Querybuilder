import React, { useState, useEffect } from 'react';
import { Database, FileText, ChevronDown, ChevronRight, Plus, X, SortAsc, SortDesc, Code, Table } from 'lucide-react';

interface DatabaseSchema {
  tables: {
    [key: string]: {
      name: string;
      columns: Array<{
        name: string;
        type: string;
      }>;
      sampleData: any[];
    }
  };
  relationships: Array<{
    from: string;
    to: string;
    type: 'ONE_TO_MANY' | 'MANY_TO_ONE';
    columns: {
      from: string;
      to: string;
    }
  }>;
}

const SAMPLE_SCHEMA: DatabaseSchema = {
  tables: {
    users: {
      name: 'users',
      columns: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'joinDate', type: 'date' }
      ],
      sampleData: [
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-02-01' }
      ]
    },
    orders: {
      name: 'orders',
      columns: [
        { name: 'id', type: 'number' },
        { name: 'userId', type: 'number' },
        { name: 'total', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'orderDate', type: 'date' }
      ],
      sampleData: [
        { id: 1, userId: 1, total: 99.99, status: 'completed', orderDate: '2024-02-01' },
        { id: 2, userId: 2, total: 149.99, status: 'pending', orderDate: '2024-02-15' }
      ]
    },
    products: {
      name: 'products',
      columns: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'category', type: 'string' }
      ],
      sampleData: [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'Headphones', price: 99.99, category: 'Electronics' }
      ]
    }
  },
  relationships: [
    {
      from: 'users',
      to: 'orders',
      type: 'ONE_TO_MANY',
      columns: {
        from: 'id',
        to: 'userId'
      }
    }
  ]
};

const SQLVisualBuilder: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [expandedTable, setExpandedTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [joins, setJoins] = useState<Array<{table: string; condition: string}>>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [having, setHaving] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const resetQuery = () => {
    setSelectedTable('');
    setExpandedTable('');
    setSelectedColumns([]);
    setJoins([]);
    setGroupBy([]);
    setHaving('');
    setOrderBy('');
    setQueryResult(null);
  };

  const generateQuery = () => {
    let query = 'SELECT ';
    query += selectedColumns.length > 0 ? selectedColumns.join(', ') : '*';
    query += `\nFROM ${selectedTable}`;
    
    if (joins.length > 0) {
      query += joins.map(join => 
        `\nJOIN ${join.table} ON ${join.condition}`
      ).join('');
    }
    
    if (groupBy.length > 0) {
      query += `\nGROUP BY ${groupBy.join(', ')}`;
      if (having) {
        query += `\nHAVING ${having}`;
      }
    }
    
    if (orderBy) {
      query += `\nORDER BY ${orderBy}`;
    }
    
    return query + ';';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background dots */}
      <div className="absolute inset-0 w-full h-full opacity-10" 
           style={{
             backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
       {/* Header */}
       <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mb-4">
            SQL Query Builder
          </h1>
          <p className="text-gray-100">
            Build and visualize complex SQL queries with an intuitive interface
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Schema Browser - 4 columns */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Schema Browser
                </h2>
              </div>
              
              <div className="p-4 space-y-2">
                {Object.entries(SAMPLE_SCHEMA.tables).map(([tableName, table]) => (
                  <div key={tableName} 
                       className="border border-gray-200 rounded-md overflow-hidden">
                    <button
                      className={`w-full px-4 py-3 flex items-center justify-between text-left
                               transition-colors duration-200 
                               ${selectedTable === tableName 
                                 ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600' 
                                 : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => {
                        setSelectedTable(tableName);
                        setExpandedTable(expandedTable === tableName ? '' : tableName);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Table className={`w-4 h-4 ${
                          selectedTable === tableName ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{tableName}</span>
                      </div>
                      {expandedTable === tableName ? 
                        <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      }
                    </button>

                    <div className={`transition-all duration-300 ease-in-out
                                   ${expandedTable === tableName ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="p-2 bg-gray-50 divide-y divide-gray-200">
                        {table.columns.map(column => (
                          <div 
                            key={column.name}
                            className="flex items-center justify-between p-2 cursor-pointer
                                     hover:bg-blue-50 rounded-md transition-colors duration-200"
                            onClick={() => {
                              if (!selectedColumns.includes(column.name)) {
                                setSelectedColumns([...selectedColumns, column.name]);
                              }
                            }}
                          >
                            <span className="text-gray-700">{column.name}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                              {column.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Query Builder - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Query Builder Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Query Builder
                </h2>
                <button
                  onClick={resetQuery}
                  className="px-4 py-2 text-sm rounded-md border border-red-200 text-red-600
                           hover:bg-red-50 transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Selected Columns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Columns
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedColumns.map(column => (
                      <div
                        key={column}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md flex items-center
                                 border border-blue-200"
                      >
                        <span>{column}</span>
                        <button
                          onClick={() => setSelectedColumns(
                            selectedColumns.filter(c => c !== column)
                          )}
                          className="ml-2 text-blue-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {selectedColumns.length === 0 && (
                      <span className="text-gray-500 italic">All columns (*)</span>
                    )}
                  </div>
                </div>

                {/* JOINs */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      JOINs
                    </label>
                    <button
                      onClick={() => setJoins([...joins, { table: '', condition: '' }])}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Join
                    </button>
                  </div>
                  {joins.map((join, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select
                        value={join.table}
                        onChange={(e) => {
                          const newJoins = [...joins];
                          newJoins[index].table = e.target.value;
                          setJoins(newJoins);
                        }}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                                 focus:ring-blue-500 text-gray-700"
                      >
                        <option value="">Select table</option>
                        {Object.keys(SAMPLE_SCHEMA.tables).map(table => (
                          <option key={table} value={table}>{table}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={join.condition}
                        onChange={(e) => {
                          const newJoins = [...joins];
                          newJoins[index].condition = e.target.value;
                          setJoins(newJoins);
                        }}
                        placeholder="Join condition"
                        className="flex-1 rounded-md border-gray-300 shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500 
                                 text-gray-700 placeholder-gray-400"
                      />
                      <button
                        onClick={() => setJoins(joins.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* GROUP BY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GROUP BY
                  </label>
                  <select
                    multiple
                    value={groupBy}
                    onChange={(e) => setGroupBy(
                      Array.from(e.target.selectedOptions).map(option => option.value)
                    )}
                    className="w-full rounded-md border-gray-300 shadow-sm
                             focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                  >
                    {selectedTable && SAMPLE_SCHEMA.tables[selectedTable].columns.map(column => (
                      <option key={column.name} value={column.name}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* HAVING */}
                {groupBy.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HAVING
                    </label>
                    <input
                      type="text"
                      value={having}
                      onChange={(e) => setHaving(e.target.value)}
                      placeholder="HAVING condition"
                      className="w-full rounded-md border-gray-300 shadow-sm
                               focus:border-blue-500 focus:ring-blue-500 
                               text-gray-700 placeholder-gray-400"
                    />
                  </div>
                )}

                {/* ORDER BY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ORDER BY
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={orderBy.split(' ')[0] || ''}
                      onChange={(e) => setOrderBy(e.target.value + (orderBy.includes('DESC') ? ' DESC' : ''))}
                      className="rounded-md border-gray-300 shadow-sm
                               focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                    >
                      <option value="">Select column</option>
                      {selectedTable && SAMPLE_SCHEMA.tables[selectedTable].columns.map(column => (
                        <option key={column.name} value={column.name}>
                          {column.name}
                        </option>
                      ))}
                    </select>
                    {orderBy && (
                      <button
                        onClick={() => setOrderBy(
                          orderBy.includes('DESC') 
                            ? orderBy.replace(' DESC', '') 
                            : orderBy + ' DESC'
                        )}
                        className="inline-flex items-center px-3 py-2 border border-gray-300
                                 rounded-md text-gray-700 bg-white hover:bg-gray-50
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {orderBy.includes('DESC') ? 
                          <SortDesc className="w-4 h-4" /> : 
                          <SortAsc className="w-4 h-4" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Query */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Generated Query
                </h2>
              </div>
              <div className="p-6">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto 
                              font-mono text-sm">
                  {selectedTable ? generateQuery() : 'Select a table to start building your query'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Query Results */}
        {selectedTable && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-600" />
                Query Results
              </h2>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {(selectedColumns.length > 0 ? selectedColumns : SAMPLE_SCHEMA.tables[selectedTable].columns.map(col => col.name))
                      .map(column => (
                        <th key={column} 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {SAMPLE_SCHEMA.tables[selectedTable].sampleData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {(selectedColumns.length > 0 ? selectedColumns : SAMPLE_SCHEMA.tables[selectedTable].columns.map(col => col.name))
                        .map(column => (
                          <td key={column} className="px-6 py-4 text-sm text-gray-500">
                            {row[column]?.toString()}
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
};

export default SQLVisualBuilder;