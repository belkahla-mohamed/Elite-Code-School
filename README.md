# Elite Code School

Application MVP pour une école de robotique, coding et IA: landing page, demandes d'inscription, validation admin, portfolios élèves, espace parent, espace teacher et base Supabase/Postgres.

## Stack

- Next.js App Router pour frontend + API backend.
- Tailwind CSS pour le design responsive.
- Supabase Postgres pour la persistance.
- Zod pour la validation des formulaires/API.

## Démarrage local

```bash
npm install
npm run dev
```

Sans variables Supabase, l'app tourne avec des données demo en mémoire.

## Brancher Supabase

1. Créer un projet Supabase.
2. Remplir `.env` ou `.env.local` avec les keys Supabase.
3. Appliquer la migration `supabase/migrations/20260619112000_initial_schema.sql`.
4. Exécuter `supabase/seed.sql` pour créer les formations.
5. Lancer `npm run build`, puis `npm start`.

### Option Supabase CLI

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Ensuite, exécuter `supabase/seed.sql` depuis SQL Editor si les formations ne sont pas encore présentes.

### Option SQL Editor

1. Ouvrir Supabase Dashboard → SQL Editor.
2. Exécuter `supabase/migrations/20260619112000_initial_schema.sql`.
3. Exécuter `supabase/seed.sql`.

## Variables d'environnement

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
AUTH_COOKIE_SECRET=
COOKIE_SECURE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Mettre `COOKIE_SECURE=true` uniquement en production HTTPS.

## Accès demo

- Admin: `/admin`, mot de passe `admin123` si `ADMIN_PASSWORD` n'est pas défini.
- Parent: `/parent`, email `parent.youssef@example.com`, secret `YOUSEEF-2026`.
- Teacher: `/teacher`, email `teacher.nadia@example.com`, secret `TEACHER-2026`.

## Fonctionnalités MVP

- Landing page responsive inspirée d'un site éducatif playful.
- Page inscription en 3 étapes.
- Une demande ne crée pas directement un élève.
- Admin peut accepter/refuser les demandes.
- Acceptation admin crée un élève + secret parent.
- Admin peut créer les teachers + secret teacher.
- Teacher peut enrichir projets, certificats et galerie.
- Parent peut rendre le portfolio public/privé.
- Portfolio public accessible via `/portfolio/[slug]`.

## Sécurité

- Public: lecture programmes + portfolios publics seulement.
- Public: création de demandes d'inscription seulement.
- Admin/teacher/parent: accès via routes API Next.js.
- `SUPABASE_SERVICE_ROLE_KEY` reste côté serveur uniquement.
- Données mineurs: ne jamais exposer `parent_secret_hash` ou `secret_hash` côté public.
