/**
 * Tipos generados manualmente para la base de datos Supabase de Strike & Beat.
 * Mapean las tablas definidas en el schema.sql.
 */

export type Database = {
  public: {
    Tables: {
      event_info: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          doors_open_time: string;
          location_name: string;
          location_address: string;
          location_logistics: string | null;
          hero_image: string | null;
          about_title: string | null;
          about_text: string | null;
          about_secondary_text: string | null;
          about_image: string | null;
          weigh_in_date: string | null;
          weigh_in_doors: string | null;
          weigh_in_time: string | null;
          weigh_in_is_free: boolean;
          total_fights: number | null;
          total_artists: number | null;
          has_bars: boolean;
          break_times: string | null;
          first_fight_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_date: string;
          doors_open_time: string;
          location_name: string;
          location_address: string;
          location_logistics?: string | null;
          hero_image?: string | null;
          about_title?: string | null;
          about_text?: string | null;
          about_secondary_text?: string | null;
          about_image?: string | null;
          weigh_in_date?: string | null;
          weigh_in_doors?: string | null;
          weigh_in_time?: string | null;
          weigh_in_is_free?: boolean;
          total_fights?: number | null;
          total_artists?: number | null;
          has_bars?: boolean;
          break_times?: string | null;
          first_fight_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          doors_open_time?: string;
          location_name?: string;
          location_address?: string;
          location_logistics?: string | null;
          hero_image?: string | null;
          about_title?: string | null;
          about_text?: string | null;
          about_secondary_text?: string | null;
          about_image?: string | null;
          weigh_in_date?: string | null;
          weigh_in_doors?: string | null;
          weigh_in_time?: string | null;
          weigh_in_is_free?: boolean;
          total_fights?: number | null;
          total_artists?: number | null;
          has_bars?: boolean;
          break_times?: string | null;
          first_fight_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          available_stock: number | null;
          management_fees: number;
          stripe_price_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          available_stock?: number | null;
          management_fees?: number;
          stripe_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          available_stock?: number | null;
          management_fees?: number;
          stripe_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fights: {
        Row: {
          id: string;
          event_id: string | null;
          name_a: string;
          image_a: string | null;
          alias_a: string | null;
          name_b: string;
          image_b: string | null;
          alias_b: string | null;
          category: string;
          rounds: string;
          rules: string;
          is_featured: boolean;
          sort_order: number;
          description_a: string | null;
          description_b: string | null;
          video_url: string | null;
          slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          name_a: string;
          image_a?: string | null;
          alias_a?: string | null;
          name_b: string;
          image_b?: string | null;
          alias_b?: string | null;
          category: string;
          rounds: string;
          rules: string;
          is_featured?: boolean;
          sort_order?: number;
          description_a?: string | null;
          description_b?: string | null;
          video_url?: string | null;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          name_a?: string;
          image_a?: string | null;
          alias_a?: string | null;
          name_b?: string;
          image_b?: string | null;
          alias_b?: string | null;
          category?: string;
          rounds?: string;
          rules?: string;
          is_featured?: boolean;
          sort_order?: number;
          description_a?: string | null;
          description_b?: string | null;
          video_url?: string | null;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          event_id: string | null;
          name: string;
          genre: string;
          image: string | null;
          profile_link: string | null;
          instagram_url: string | null;
          spotify_url: string | null;
          youtube_url: string | null;
          description: string | null;
          video_url: string | null;
          hero_image: string | null;
          slug: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          name: string;
          genre: string;
          image?: string | null;
          profile_link?: string | null;
          instagram_url?: string | null;
          spotify_url?: string | null;
          youtube_url?: string | null;
          description?: string | null;
          video_url?: string | null;
          hero_image?: string | null;
          slug?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          name?: string;
          genre?: string;
          image?: string | null;
          profile_link?: string | null;
          instagram_url?: string | null;
          spotify_url?: string | null;
          youtube_url?: string | null;
          description?: string | null;
          video_url?: string | null;
          hero_image?: string | null;
          slug?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {
        Row: {
          id: string;
          event_id: string | null;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          tier: string;
          opacity: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          tier?: string;
          opacity?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          tier?: string;
          opacity?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          event_id: string | null;
          question: string;
          answer: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          question: string;
          answer: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          question?: string;
          answer?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_full_name: string;
          customer_email: string;
          customer_document_id: string;
          address_street: string;
          address_city: string;
          address_zip_code: string;
          address_country: string;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_full_name: string;
          customer_email: string;
          customer_document_id: string;
          address_street: string;
          address_city: string;
          address_zip_code: string;
          address_country?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          total_amount: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_full_name?: string;
          customer_email?: string;
          customer_document_id?: string;
          address_street?: string;
          address_city?: string;
          address_zip_code?: string;
          address_country?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          total_amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          ticket_id: string | null;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          ticket_id?: string | null;
          quantity: number;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          ticket_id?: string | null;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
      };
    };
  };
};
