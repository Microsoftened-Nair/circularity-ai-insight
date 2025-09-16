-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'engineer', 'manager')) DEFAULT 'engineer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  metal VARCHAR(20) CHECK (metal IN ('aluminium', 'copper', 'steel', 'lithium', 'other')) NOT NULL,
  production_route JSONB,
  inputs JSONB,
  predicted_params JSONB,
  results JSONB,
  circularity_score FLOAT,
  status VARCHAR(20) CHECK (status IN ('draft', 'computed', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create LCA factors table
CREATE TABLE public.lca_factors (
  id BIGSERIAL PRIMARY KEY,
  process_name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  emission_co2_per_unit FLOAT,
  energy_kwh_per_unit FLOAT,
  water_liters_per_unit FLOAT,
  source VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create models table for ML model tracking
CREATE TABLE public.models (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  version VARCHAR(50),
  path VARCHAR(512),
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT REFERENCES public.assessments(id) ON DELETE CASCADE,
  rank INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_co2_reduction FLOAT,
  estimated_cost_change FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lca_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create RLS policies for assessments
CREATE POLICY "Users can view their own assessments" 
ON public.assessments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create assessments" 
ON public.assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
ON public.assessments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" 
ON public.assessments FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for LCA factors (read-only for users, admins can manage)
CREATE POLICY "Everyone can view LCA factors" 
ON public.lca_factors FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage LCA factors" 
ON public.lca_factors FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for models (read-only for users, admins can manage)
CREATE POLICY "Everyone can view models" 
ON public.models FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage models" 
ON public.models FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for recommendations
CREATE POLICY "Users can view recommendations for their assessments" 
ON public.recommendations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.assessments 
    WHERE id = assessment_id AND user_id = auth.uid()
  )
);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (NEW.id, 
          COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
          NEW.email, 
          'engineer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lca_factors_updated_at
  BEFORE UPDATE ON public.lca_factors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial LCA factors
INSERT INTO public.lca_factors (process_name, unit, emission_co2_per_unit, energy_kwh_per_unit, water_liters_per_unit, source) VALUES
('Aluminium Primary Smelting', 'kg', 11.5, 15.0, 0.5, 'IAI Global Aluminium Industry'),
('Aluminium Secondary (Recycling)', 'kg', 0.6, 0.7, 0.02, 'IAI Global Aluminium Industry'),
('Copper Primary Extraction', 'kg', 3.2, 4.5, 12.0, 'ICSG Copper Industry Data'),
('Copper Secondary (Recycling)', 'kg', 0.4, 0.8, 0.8, 'ICSG Copper Industry Data'),
('Steel Primary (BOF)', 'kg', 2.3, 0.6, 2.5, 'World Steel Association'),
('Steel Secondary (EAF)', 'kg', 0.4, 0.5, 0.3, 'World Steel Association'),
('Road Transport', 'tonne-km', 0.1, 0.0, 0.0, 'DEFRA Transport Factors'),
('Sea Transport', 'tonne-km', 0.015, 0.0, 0.0, 'IMO Shipping Guidelines'),
('Grid Electricity (Global Average)', 'kWh', 0.5, 1.0, 0.0, 'IEA Energy Statistics');