-- Fan Hub: mark Ewura Abena's own (admin) account(s) as "official" so the feed
-- can badge their posts and offer an Official filter.

alter table public.fan_profiles add column if not exists is_official boolean not null default false;

update public.fan_profiles fp
set is_official = true
from public.profiles p
where p.id = fp.id and p.role = 'admin';

-- Keep the flag in sync when a role changes.
create or replace function public.sync_fan_official()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.fan_profiles set is_official = (new.role = 'admin') where id = new.id;
  return new;
end;
$$;

drop trigger if exists profiles_sync_fan_official on public.profiles;
create trigger profiles_sync_fan_official
  after insert or update of role on public.profiles
  for each row execute function public.sync_fan_official();

-- A fan must not be able to flip their own flag.
create or replace function public.protect_fan_official()
returns trigger
language plpgsql
as $$
begin
  if new.is_official is distinct from old.is_official and auth.uid() is not null and not public.is_admin(auth.uid()) then
    new.is_official := old.is_official;
  end if;
  return new;
end;
$$;

drop trigger if exists fan_profiles_protect_official on public.fan_profiles;
create trigger fan_profiles_protect_official
  before update on public.fan_profiles
  for each row execute function public.protect_fan_official();
