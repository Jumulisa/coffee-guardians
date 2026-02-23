import { supabase } from './supabase'

// User profiles
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Diagnosis history
export async function getDiagnosisHistory(userId: string) {
  const { data, error } = await supabase
    .from('diagnosis_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function saveDiagnosis(
  userId: string,
  diagnosis: {
    image_url: string
    disease_name: string
    confidence: number
    severity: string
    affected_area: number
    treatment_action: string
    treatment_duration?: string
    estimated_cost?: string
  }
) {
  const { data, error } = await supabase
    .from('diagnosis_history')
    .insert([
      {
        user_id: userId,
        ...diagnosis,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDiagnosis(diagnosisId: string) {
  const { error } = await supabase
    .from('diagnosis_history')
    .delete()
    .eq('id', diagnosisId)

  if (error) throw error
}

// User settings
export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // If no settings exist, create default ones
    if (error.code === 'PGRST116') {
      return createDefaultUserSettings(userId)
    }
    throw error
  }
  return data
}

export async function updateUserSettings(
  userId: string,
  settings: {
    language?: string
    notifications_enabled?: boolean
    theme_preference?: string
    auto_save_history?: boolean
  }
) {
  const { data, error } = await supabase
    .from('user_settings')
    .update({ ...settings, updated_at: new Date() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

async function createDefaultUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .insert([
      {
        user_id: userId,
        language: 'en',
        notifications_enabled: true,
        theme_preference: 'light',
        auto_save_history: true,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// Diseases reference data
export async function getDiseases() {
  const { data, error } = await supabase
    .from('diseases')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getDiseaseByName(name: string) {
  const { data, error } = await supabase
    .from('diseases')
    .select('*')
    .eq('name', name)
    .single()

  if (error) throw error
  return data
}
