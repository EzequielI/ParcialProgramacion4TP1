import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Supabase {

  private client: SupabaseClient;

  constructor(){
    const supabaseURL = 'https://kdtywfxondakasjqgatb.supabase.co/rest/v1/'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdHl3ZnhvbmRha2FzanFnYXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NTc5NjIsImV4cCI6MjA5MzUzMzk2Mn0.B88dGkmi9lDRF9jz6y0jgbRFd8uje4d97_73ENUKYnM'
    this.client = createClient(supabaseURL, supabaseKey);
  }

  getClient(): SupabaseClient{
    return this.client;

}

}
