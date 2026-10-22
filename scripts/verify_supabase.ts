import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcglksvcqmymjyqoyrtw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2xrc3ZjcW15bWp5cW95cnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDgyMjEsImV4cCI6MjEwMDI4NDIyMX0.aEMtyTayA3ePFRzeTjEK6a_JjRiE6LP1nu_ET1SPGuY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('Testing live Supabase connection to:', supabaseUrl);

  const { data: creators, error: crErr } = await supabase.from('creators').select('id, full_name, primary_niche').limit(5);
  if (crErr) {
    console.error('❌ Table "creators" check failed:', crErr.message);
  } else {
    console.log(`✅ Table "creators" is LIVE! Found ${creators?.length} creators:`, creators?.map(c => c.full_name).join(', '));
  }

  const { data: requests, error: reqErr } = await supabase.from('collaboration_requests').select('id, brand_name, service_title, status').limit(5);
  if (reqErr) {
    console.error('❌ Table "collaboration_requests" check failed:', reqErr.message);
  } else {
    console.log(`✅ Table "collaboration_requests" is LIVE! Found ${requests?.length} deals:`, requests?.map(r => r.id).join(', '));
  }

  const { data: users, error: uErr } = await supabase.from('users').select('id, name, role').limit(5);
  if (uErr) {
    console.error('❌ Table "users" check failed:', uErr.message);
  } else {
    console.log(`✅ Table "users" is LIVE! Found ${users?.length} users:`, users?.map(u => u.name).join(', '));
  }

  const { data: campaigns, error: cmpErr } = await supabase.from('campaigns').select('id, name').limit(5);
  if (cmpErr) {
    console.error('❌ Table "campaigns" check failed:', cmpErr.message);
  } else {
    console.log(`✅ Table "campaigns" is LIVE! Found ${campaigns?.length} campaigns:`, campaigns?.map(c => c.name).join(', '));
  }

  const { data: leads, error: leadErr } = await supabase.from('agency_leads').select('id').limit(5);
  if (leadErr) {
    console.error('❌ Table "agency_leads" check failed:', leadErr.message);
  } else {
    console.log(`✅ Table "agency_leads" is LIVE! Accessible and ready.`);
  }

  const { data: tickets, error: ticketErr } = await supabase.from('support_tickets').select('id').limit(5);
  if (ticketErr) {
    console.error('❌ Table "support_tickets" check failed:', ticketErr.message);
  } else {
    console.log(`✅ Table "support_tickets" is LIVE! Accessible and ready.`);
  }
}

verify();
