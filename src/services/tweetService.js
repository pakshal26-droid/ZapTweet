import { supabase } from '../supabaseClient';

export const tweetService = {
  async saveTweet(tweetContent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('saved_tweets')
        .insert([
          { user_id: user.id, tweet_content: tweetContent }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving tweet:', error);
      throw error;
    }
  },

  async fetchSavedTweets() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('saved_tweets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  },

  async deleteTweet(tweetId) {
    try {
      const { error } = await supabase
        .from('saved_tweets')
        .delete()
        .eq('id', tweetId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting tweet:', error);
      throw error;
    }
  }
}; 