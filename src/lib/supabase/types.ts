export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id: string
          variant_id?: string | null
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          discount_type: string
          discount_value: number
          minimum_order_amount: number
          max_discount_amount: number | null
          usage_limit: number | null
          used_count: number
          is_active: boolean
          valid_from: string
          valid_until: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          discount_type: string
          discount_value: number
          minimum_order_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          minimum_order_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          created_at?: string
        }
      }
      inventory_movements: {
        Row: {
          id: string
          product_id: string | null
          variant_id: string | null
          movement_type: string
          quantity: number
          reason: string | null
          reference_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          variant_id?: string | null
          movement_type: string
          quantity: number
          reason?: string | null
          reference_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          variant_id?: string | null
          movement_type?: string
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          variant_details: Json | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          variant_details?: Json | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name?: string
          variant_details?: Json | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          status: string
          payment_method: string
          payment_status: string
          currency: string
          shipping_address: Json
          billing_address: Json | null
          shipping_method: string | null
          tracking_number: string | null
          notes: string | null
          admin_notes: string | null
          cancelled_reason: string | null
          cancelled_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          status?: string
          payment_method?: string
          payment_status?: string
          currency?: string
          shipping_address: Json
          billing_address?: Json | null
          shipping_method?: string | null
          tracking_number?: string | null
          notes?: string | null
          admin_notes?: string | null
          cancelled_reason?: string | null
          cancelled_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          status?: string
          payment_method?: string
          payment_status?: string
          currency?: string
          shipping_address?: Json
          billing_address?: Json | null
          shipping_method?: string | null
          tracking_number?: string | null
          notes?: string | null
          admin_notes?: string | null
          cancelled_reason?: string | null
          cancelled_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          page_type: string
          page_id: string | null
          user_id: string | null
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_type: string
          page_id?: string | null
          user_id?: string | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          page_type?: string
          page_id?: string | null
          user_id?: string | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          guest_name: string | null
          guest_email: string | null
          rating: number
          title: string | null
          content: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          rating: number
          title?: string | null
          content?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          rating?: number
          title?: string | null
          content?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          variant_type: string
          variant_name: string
          variant_value: string
          price_adjustment: number
          cost_price_adjustment: number
          stock_quantity: number
          sku_suffix: string | null
          image_url: string | null
          hex_color: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_type: string
          variant_name: string
          variant_value: string
          price_adjustment?: number
          cost_price_adjustment?: number
          stock_quantity?: number
          sku_suffix?: string | null
          image_url?: string | null
          hex_color?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_type?: string
          variant_name?: string
          variant_value?: string
          price_adjustment?: number
          cost_price_adjustment?: number
          stock_quantity?: number
          sku_suffix?: string | null
          image_url?: string | null
          hex_color?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          base_price: number
          sale_price: number | null
          cost_price: number | null
          category_id: string | null
          brand: string | null
          sku: string | null
          barcode: string | null
          weight: number | null
          dimensions: Json | null
          images: string[]
          tags: string[]
          features: string[]
          specifications: Json
          is_active: boolean
          is_featured: boolean
          has_variants: boolean
          stock_quantity: number
          low_stock_threshold: number
          track_inventory: boolean
          allow_backorders: boolean
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          views_count: number
          sales_count: number
          rating_average: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          base_price: number
          sale_price?: number | null
          cost_price?: number | null
          category_id?: string | null
          brand?: string | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          images?: string[]
          tags?: string[]
          features?: string[]
          specifications?: Json
          is_active?: boolean
          is_featured?: boolean
          has_variants?: boolean
          stock_quantity?: number
          low_stock_threshold?: number
          track_inventory?: boolean
          allow_backorders?: boolean
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          views_count?: number
          sales_count?: number
          rating_average?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          base_price?: number
          sale_price?: number | null
          cost_price?: number | null
          category_id?: string | null
          brand?: string | null
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          images?: string[]
          tags?: string[]
          features?: string[]
          specifications?: Json
          is_active?: boolean
          is_featured?: boolean
          has_variants?: boolean
          stock_quantity?: number
          low_stock_threshold?: number
          track_inventory?: boolean
          allow_backorders?: boolean
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          views_count?: number
          sales_count?: number
          rating_average?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          role: string
          phone: string | null
          address: Json | null
          avatar_url: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: string
          phone?: string | null
          address?: Json | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          phone?: string | null
          address?: Json | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      search_analytics: {
        Row: {
          id: string
          search_term: string
          results_count: number
          user_id: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          search_term: string
          results_count?: number
          user_id?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          search_term?: string
          results_count?: number
          user_id?: string | null
          session_id?: string | null
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: {}
        Returns: string
      }
    }
    Enums: {
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
      user_role: "customer" | "admin" | "super_admin"
      variant_type: "color" | "size" | "version" | "material" | "style"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
