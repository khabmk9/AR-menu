export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          address: string | null;
          phone: string | null;
          website: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          address?: string | null;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          address?: string | null;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menus: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          design_theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          design_theme?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          design_theme?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          menu_id: string;
          name: string;
          icon: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          name: string;
          icon?: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          name?: string;
          icon?: string;
          position?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          menu_id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          category: string;
          image_url: string | null;
          is_available: boolean;
          is_popular: boolean;
          dietary_info: Json;
          allergens: Json;
          spicy_level: number;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          category?: string;
          image_url?: string | null;
          is_available?: boolean;
          is_popular?: boolean;
          dietary_info?: Json;
          allergens?: Json;
          spicy_level?: number;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          image_url?: string | null;
          is_available?: boolean;
          is_popular?: boolean;
          dietary_info?: Json;
          allergens?: Json;
          spicy_level?: number;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          menu_id: string;
          restaurant_id: string;
          short_code: string;
          scan_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          restaurant_id: string;
          short_code?: string;
          scan_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          restaurant_id?: string;
          short_code?: string;
          scan_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      ar_sessions: {
        Row: {
          id: string;
          menu_id: string;
          viewer_ip: string | null;
          viewer_location: string | null;
          device_type: string | null;
          session_duration: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          viewer_ip?: string | null;
          viewer_location?: string | null;
          device_type?: string | null;
          session_duration?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          viewer_ip?: string | null;
          viewer_location?: string | null;
          device_type?: string | null;
          session_duration?: number | null;
          created_at?: string;
        };
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
  };
}
