import { supabase } from '../supabaseClient';

export const linkedinService = {
  async saveLinkedInPost(postContent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('saved_linkedin_posts')
        .insert([
          { user_id: user.id, content: postContent }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving LinkedIn post:', error);
      throw error;
    }
  },

  async fetchSavedPosts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('saved_linkedin_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
      throw error;
    }
  },

  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('saved_linkedin_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting LinkedIn post:', error);
      throw error;
    }
  }
};
