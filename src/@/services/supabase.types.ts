export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat: {
        Row: {
          created_at: string | null
          id: number
          message: string | null
          sender: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          sender?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          sender?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sender_fkey"
            columns: ["sender"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post: {
        Row: {
          author: string | null
          content: string | null
          created_at: string | null
          id: number
          isDone: boolean | null
          tag: number | null
          title: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          isDone?: boolean | null
          tag?: number | null
          title?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          isDone?: boolean | null
          tag?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tag_fkey"
            columns: ["tag"]
            referencedRelation: "tag"
            referencedColumns: ["id"]
          }
        ]
      }
      status: {
        Row: {
          created_at: string | null
          id: number
          label: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          label?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          label?: string | null
        }
        Relationships: []
      }
      stock: {
        Row: {
          adjRatio: number | null
          buyCount: number | null
          buyForeignQuantity: number | null
          buyForeignValue: number | null
          buyQuantity: number | null
          currentForeignRoom: number | null
          date: string | null
          dealVolume: number | null
          id: number
          key: string
          priceAverage: number | null
          priceBasic: number | null
          priceClose: number | null
          priceHigh: number | null
          priceLow: number | null
          priceOpen: number | null
          propTradingNetDealValue: number | null
          propTradingNetPTValue: number | null
          propTradingNetValue: number | null
          putthroughValue: number | null
          putthroughVolume: number | null
          sellCount: number | null
          sellForeignQuantity: number | null
          sellForeignValue: number | null
          sellQuantity: number | null
          symbol: string | null
          totalValue: number | null
          totalVolume: number | null
        }
        Insert: {
          adjRatio?: number | null
          buyCount?: number | null
          buyForeignQuantity?: number | null
          buyForeignValue?: number | null
          buyQuantity?: number | null
          currentForeignRoom?: number | null
          date?: string | null
          dealVolume?: number | null
          id?: number
          key: string
          priceAverage?: number | null
          priceBasic?: number | null
          priceClose?: number | null
          priceHigh?: number | null
          priceLow?: number | null
          priceOpen?: number | null
          propTradingNetDealValue?: number | null
          propTradingNetPTValue?: number | null
          propTradingNetValue?: number | null
          putthroughValue?: number | null
          putthroughVolume?: number | null
          sellCount?: number | null
          sellForeignQuantity?: number | null
          sellForeignValue?: number | null
          sellQuantity?: number | null
          symbol?: string | null
          totalValue?: number | null
          totalVolume?: number | null
        }
        Update: {
          adjRatio?: number | null
          buyCount?: number | null
          buyForeignQuantity?: number | null
          buyForeignValue?: number | null
          buyQuantity?: number | null
          currentForeignRoom?: number | null
          date?: string | null
          dealVolume?: number | null
          id?: number
          key?: string
          priceAverage?: number | null
          priceBasic?: number | null
          priceClose?: number | null
          priceHigh?: number | null
          priceLow?: number | null
          priceOpen?: number | null
          propTradingNetDealValue?: number | null
          propTradingNetPTValue?: number | null
          propTradingNetValue?: number | null
          putthroughValue?: number | null
          putthroughVolume?: number | null
          sellCount?: number | null
          sellForeignQuantity?: number | null
          sellForeignValue?: number | null
          sellQuantity?: number | null
          symbol?: string | null
          totalValue?: number | null
          totalVolume?: number | null
        }
        Relationships: []
      }
      stock_base: {
        Row: {
          buy_point: Json | null
          config: Json | null
          created_at: string | null
          id: number
          is_blacklist: boolean | null
          list_base: Json[] | null
          symbol: string
        }
        Insert: {
          buy_point?: Json | null
          config?: Json | null
          created_at?: string | null
          id?: number
          is_blacklist?: boolean | null
          list_base?: Json[] | null
          symbol: string
        }
        Update: {
          buy_point?: Json | null
          config?: Json | null
          created_at?: string | null
          id?: number
          is_blacklist?: boolean | null
          list_base?: Json[] | null
          symbol?: string
        }
        Relationships: []
      }
      stock_info: {
        Row: {
          created_at: string | null
          id: number
          last_updated: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          last_updated?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          last_updated?: string | null
        }
        Relationships: []
      }
      tag: {
        Row: {
          created_at: string | null
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          reporter: string | null
          tags: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          reporter?: string | null
          tags?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          reporter?: string | null
          tags?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_reporter_fkey"
            columns: ["reporter"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_tags_fkey"
            columns: ["tags"]
            referencedRelation: "tag"
            referencedColumns: ["id"]
          }
        ]
      }
      todo: {
        Row: {
          author: string | null
          content: string | null
          created_at: string | null
          id: number
          isDone: boolean | null
          status: number | null
          tag: number | null
          title: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          isDone?: boolean | null
          status?: number | null
          tag?: number | null
          title?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          isDone?: boolean | null
          status?: number | null
          tag?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todo_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_status_fkey"
            columns: ["status"]
            referencedRelation: "status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_tag_fkey"
            columns: ["tag"]
            referencedRelation: "tag"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
