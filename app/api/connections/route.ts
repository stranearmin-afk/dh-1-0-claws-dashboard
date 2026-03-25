export async function GET() {
  try {
    // Return all active connections and integrations
    const connections = [
      {
        id: 'gmail',
        name: 'Gmail',
        icon: '📧',
        status: 'active',
        description: 'Email (IMAP/SMTP)',
        accounts: ['stranearmin@gmail.com', 'dk.heinz@gmail.com'],
        provider: 'Google'
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        icon: '📅',
        status: 'active',
        description: 'Calendar events & scheduling',
        accounts: ['7 calendars (personal + company)'],
        provider: 'Google'
      },
      {
        id: 'google-drive',
        name: 'Google Drive',
        icon: '📁',
        status: 'active',
        description: 'Cloud storage & file sync',
        accounts: ['5 key folders (01-04, 99)'],
        provider: 'Google'
      },
      {
        id: 'google-sheets',
        name: 'Google Sheets',
        icon: '📊',
        status: 'active',
        description: 'Data management & databases',
        accounts: ['STAFF SERGEANT Feedback', 'Performance Tracking'],
        provider: 'Google'
      },
      {
        id: 'telegram',
        name: 'Telegram',
        icon: '💬',
        status: 'active',
        description: 'Messaging & notifications',
        accounts: ['@dhclawsbot (185904095)'],
        provider: 'Telegram'
      },
      {
        id: 'anthropic-api',
        name: 'Anthropic API',
        icon: '🤖',
        status: 'active',
        description: 'Claude AI models',
        accounts: ['claude-opus-4-6', 'claude-sonnet-4-5'],
        provider: 'Anthropic'
      }
    ];

    return Response.json({
      connections,
      total: connections.length,
      active_count: connections.filter(c => c.status === 'active').length,
      providers: ['Google', 'Telegram', 'Anthropic'],
      last_updated: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch connections', details: String(error) },
      { status: 500 }
    );
  }
}