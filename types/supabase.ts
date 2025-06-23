export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
// Generated using supabase
export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      activities: {
        Row: {
          appointment: string | null;
          content: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          type: string | null;
        };
        Insert: {
          appointment?: string | null;
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          type?: string | null;
        };
        Update: {
          appointment?: string | null;
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'activities_appointment_fkey';
            columns: ['appointment'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
        ];
      };
      appointment_assignee: {
        Row: {
          appointment: string | null;
          created_at: string;
          id: string;
          user: string | null;
          user_type: string | null;
        };
        Insert: {
          appointment?: string | null;
          created_at?: string;
          id?: string;
          user?: string | null;
          user_type?: string | null;
        };
        Update: {
          appointment?: string | null;
          created_at?: string;
          id?: string;
          user?: string | null;
          user_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'appointment_assignee_appointment_fkey';
            columns: ['appointment'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
        ];
      };
      appointments: {
        Row: {
          attachements: string[] | null;
          category: string | null;
          created_at: string;
          end: string | null;
          id: string;
          location: string | null;
          notes: string | null;
          patient: string | null;
          start: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          attachements?: string[] | null;
          category?: string | null;
          created_at?: string;
          end?: string | null;
          id?: string;
          location?: string | null;
          notes?: string | null;
          patient?: string | null;
          start?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          attachements?: string[] | null;
          category?: string | null;
          created_at?: string;
          end?: string | null;
          id?: string;
          location?: string | null;
          notes?: string | null;
          patient?: string | null;
          start?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_patient_fkey';
            columns: ['patient'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      patients: {
        Row: {
          active: boolean | null;
          active_since: string | null;
          birth_date: string | null;
          care_level: number | null;
          created_at: string;
          email: string | null;
          firstname: string | null;
          id: string;
          lastname: string | null;
          pronoun: string | null;
        };
        Insert: {
          active?: boolean | null;
          active_since?: string | null;
          birth_date?: string | null;
          care_level?: number | null;
          created_at?: string;
          email?: string | null;
          firstname?: string | null;
          id?: string;
          lastname?: string | null;
          pronoun?: string | null;
        };
        Update: {
          active?: boolean | null;
          active_since?: string | null;
          birth_date?: string | null;
          care_level?: number | null;
          created_at?: string;
          email?: string | null;
          firstname?: string | null;
          id?: string;
          lastname?: string | null;
          pronoun?: string | null;
        };
        Relationships: [];
      };
      relatives: {
        Row: {
          created_at: string;
          firstname: string | null;
          id: string;
          lastname: string | null;
          notes: string | null;
          pronoun: string | null;
        };
        Insert: {
          created_at?: string;
          firstname?: string | null;
          id?: string;
          lastname?: string | null;
          notes?: string | null;
          pronoun?: string | null;
        };
        Update: {
          created_at?: string;
          firstname?: string | null;
          id?: string;
          lastname?: string | null;
          notes?: string | null;
          pronoun?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
