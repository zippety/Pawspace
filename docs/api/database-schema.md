# 🦴 PawSpace Database Schema

## 🐾 Overview
PawSpace uses Supabase as our database provider, giving us the power of PostgreSQL with the simplicity of a modern API. Here's how our data is organized:

## 📊 Tables

### 🧑‍💼 Users
Stores information about our human users (both space owners and seekers).
```sql
users (
  id            uuid references auth.users primary key,
  email         text unique not null,
  full_name     text,
  avatar_url    text,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
)
```

### 🏡 Spaces
Represents available dog spaces (yards, parks, etc.).
```sql
spaces (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references users(id) not null,
  title         text not null,
  description   text,
  address       text not null,
  city          text not null,
  state         text not null,
  zip_code      text not null,
  latitude      decimal(10,8) not null,
  longitude     decimal(11,8) not null,
  price_per_hour decimal(10,2) not null,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
)
```

### 📸 Space Images
Stores images associated with spaces.
```sql
space_images (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid references spaces(id) on delete cascade,
  url           text not null,
  is_primary    boolean default false,
  created_at    timestamp with time zone default now()
)
```

### 📅 Bookings
Tracks space reservations.
```sql
bookings (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid references spaces(id) not null,
  user_id       uuid references users(id) not null,
  start_time    timestamp with time zone not null,
  end_time      timestamp with time zone not null,
  total_price   decimal(10,2) not null,
  status        text not null check (status in ('pending', 'confirmed', 'cancelled')),
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
)
```

### ⭐ Reviews
Stores user reviews for spaces.
```sql
reviews (
  id            uuid primary key default uuid_generate_v4(),
  booking_id    uuid references bookings(id) not null,
  user_id       uuid references users(id) not null,
  space_id      uuid references spaces(id) not null,
  rating        integer not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
)
```

### 🔔 Notifications
Manages system notifications for users.
```sql
notifications (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references users(id) not null,
  type          text not null,
  message       text not null,
  read          boolean default false,
  created_at    timestamp with time zone default now()
)
```

## 🔒 Row Level Security (RLS) Policies

### Users Table
```sql
-- Users can read their own profile
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);
```

### Spaces Table
```sql
-- Anyone can view spaces
create policy "Spaces are viewable by everyone"
  on spaces for select
  using (true);

-- Only space owners can update their spaces
create policy "Users can update own spaces"
  on spaces for update
  using (auth.uid() = owner_id);
```

### Bookings Table
```sql
-- Users can view their own bookings
create policy "Users can view own bookings"
  on bookings for select
  using (auth.uid() = user_id);

-- Space owners can view bookings for their spaces
create policy "Owners can view space bookings"
  on bookings for select
  using (auth.uid() in (
    select owner_id from spaces where id = space_id
  ));
```

## 🔄 Database Functions

### Booking Creation
```sql
create or replace function create_booking(
  p_space_id uuid,
  p_start_time timestamp with time zone,
  p_end_time timestamp with time zone
) returns uuid as $$
declare
  v_booking_id uuid;
  v_price_per_hour decimal(10,2);
  v_total_price decimal(10,2);
  v_hours decimal(10,2);
begin
  -- Get price per hour
  select price_per_hour into v_price_per_hour
  from spaces
  where id = p_space_id;

  -- Calculate total hours (rounded to nearest 0.5)
  v_hours := ceil(extract(epoch from (p_end_time - p_start_time))/1800)/2;

  -- Calculate total price
  v_total_price := v_price_per_hour * v_hours;

  -- Create booking
  insert into bookings (
    space_id,
    user_id,
    start_time,
    end_time,
    total_price,
    status
  ) values (
    p_space_id,
    auth.uid(),
    p_start_time,
    p_end_time,
    v_total_price,
    'pending'
  ) returning id into v_booking_id;

  return v_booking_id;
end;
$$ language plpgsql security definer;
```

## 🔍 Indexes
```sql
-- Spatial index for location-based queries
create index spaces_location_idx
  on spaces using gist (
    ll_to_earth(latitude, longitude)
  );

-- Index for booking time ranges
create index bookings_time_range_idx
  on bookings using gist (
    tstzrange(start_time, end_time)
  );

-- Index for fast status lookups
create index bookings_status_idx
  on bookings(status);
```

## 🔐 Authentication
We use Supabase Auth with the following configuration:
- Email/Password authentication
- Google OAuth provider
- Password reset functionality
- Email verification required

## 🚀 Performance Considerations
1. Spatial queries use PostGIS for efficient location-based searches
2. Booking time ranges use GIST indexes for fast availability checks
3. Commonly accessed fields are properly indexed
4. Regular VACUUM and maintenance operations are scheduled

## 🔄 Migrations
Database migrations are version controlled and can be found in the `/migrations` directory. Each migration is timestamped and includes both up and down SQL scripts.
