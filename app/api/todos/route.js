import { randomUUID } from 'crypto';

// In-memory store (in production, this would be a database)
let todos = [
  {
    id: randomUUID(),
    title: 'Example todo - click to edit',
    description: 'This is how todos work on the dashboard',
    priority: 'medium',
    completed: false,
    created_at: new Date().toISOString(),
    due_date: null,
    tags: []
  }
];

// GET: Return all open todos (completed=false) sorted by priority
export async function GET() {
  try {
    const openTodos = todos.filter(todo => !todo.completed);
    
    // Sort by priority: high -> medium -> low
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    const sorted = openTodos.sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      return aPriority - bPriority;
    });
    
    return new Response(JSON.stringify({ todos: sorted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('GET /api/todos error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST: Add new todo (title required)
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const newTodo = {
      id: randomUUID(),
      title: body.title.trim(),
      description: body.description || '',
      priority: ['high', 'medium', 'low'].includes(body.priority) ? body.priority : 'medium',
      completed: false,
      created_at: new Date().toISOString(),
      due_date: body.due_date || null,
      tags: Array.isArray(body.tags) ? body.tags : []
    };
    
    todos.push(newTodo);
    
    return new Response(JSON.stringify({ todo: newTodo }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('POST /api/todos error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT: Update todo (id required)
export async function PUT(request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const todoIndex = todos.findIndex(t => t.id === body.id);
    
    if (todoIndex === -1) {
      return new Response(JSON.stringify({ error: 'Todo not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const todo = todos[todoIndex];
    
    // Update fields if provided
    if (body.title !== undefined) todo.title = body.title.trim();
    if (body.description !== undefined) todo.description = body.description;
    if (body.priority !== undefined && ['high', 'medium', 'low'].includes(body.priority)) {
      todo.priority = body.priority;
    }
    if (body.completed !== undefined) todo.completed = Boolean(body.completed);
    if (body.due_date !== undefined) todo.due_date = body.due_date;
    if (body.tags !== undefined) todo.tags = Array.isArray(body.tags) ? body.tags : [];
    
    return new Response(JSON.stringify({ todo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('PUT /api/todos error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE: Delete todo by id
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return new Response(JSON.stringify({ error: 'Todo not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const [deleted] = todos.splice(todoIndex, 1);
    
    return new Response(JSON.stringify({ todo: deleted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DELETE /api/todos error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}