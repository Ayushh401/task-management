/*
  # Task Management Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `status` (text, enum: todo, in_progress, completed)
      - `priority` (text, enum: low, medium, high)
      - `due_date` (timestamptz, nullable)
      - `created_at` (timestamptz, default: now())
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for CRUD operations
*/

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);