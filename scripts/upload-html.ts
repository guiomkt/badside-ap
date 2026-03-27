import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mhdykhfxwaqzkpsbhbzk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZHlraGZ4d2Fxemtwc2JoYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDEyNjgsImV4cCI6MjA5MDExNzI2OH0.-eoczYwfXrv90Wi0N3AOWPk6fYxZjwV_cDmQ4AQZVz8'
);

async function main() {
  const html = readFileSync('/Users/rafaelriedel/Documents/GUIO/BADSIDE 2/index.html', 'utf-8');
  console.log('HTML length:', html.length);

  const { data, error } = await supabase
    .from('presentations')
    .update({ html_content: html })
    .eq('id', 'ea77eac8-efa7-4d86-a0be-03c15d65db33')
    .select('id, public_token');

  if (error) {
    console.error('Supabase error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Success:', JSON.stringify(data, null, 2));
  }
}

main();
