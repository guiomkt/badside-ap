// Run with: npx tsx scripts/import-bedside.ts
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mhdykhfxwaqzkpsbhbzk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZHlraGZ4d2Fxemtwc2JoYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDEyNjgsImV4cCI6MjA5MDExNzI2OH0.-eoczYwfXrv90Wi0N3AOWPk6fYxZjwV_cDmQ4AQZVz8'
);

async function main() {
  const html = readFileSync('/Users/rafaelriedel/Documents/GUIO/BADSIDE 2/index.html', 'utf-8');

  // Get or create workspace
  let { data: ws } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', 'bedside-medicine')
    .single();

  if (!ws) {
    const { data } = await supabase
      .from('workspaces')
      .insert({ name: 'Bedside Medicine', slug: 'bedside-medicine' })
      .select('id')
      .single();
    ws = data;
  }

  if (!ws) { console.error('Failed to create workspace'); return; }

  // Check if presentation already exists
  const { data: existing } = await supabase
    .from('presentations')
    .select('id')
    .eq('workspace_id', ws.id)
    .eq('slug', 'planejamento-estrategico')
    .single();

  if (existing) {
    // Update existing
    const { data: pres, error } = await supabase
      .from('presentations')
      .update({
        title: 'Planejamento Estratégico Digital',
        html_content: html,
        slide_data: { title: 'Bedside Medicine', slides: [] },
        status: 'live',
        is_public: true,
      })
      .eq('id', existing.id)
      .select('id, public_token')
      .single();

    if (error) console.error('Error:', error);
    else console.log('Presentation updated!', pres);
  } else {
    // Insert new
    const { data: pres, error } = await supabase
      .from('presentations')
      .insert({
        workspace_id: ws.id,
        title: 'Planejamento Estratégico Digital',
        slug: 'planejamento-estrategico',
        html_content: html,
        slide_data: { title: 'Bedside Medicine', slides: [] },
        status: 'live',
        is_public: true,
      })
      .select('id, public_token')
      .single();

    if (error) console.error('Error:', error);
    else console.log('Presentation imported!', pres);
  }
}

main();
