insert into public.programs (id, title, age_range, level, description, tools, price_monthly, icon, color, sort_order)
values
  (
    'scratch-creativite',
    'Scratch & Créativité',
    '7–10 ans',
    'debutant',
    'Jeux, histoires animées et premières notions d''algorithmique avec Scratch et Micro:bit.',
    array['Scratch', 'Micro:bit'],
    650,
    '🧩',
    'accent',
    1
  ),
  (
    'robotique-mbot',
    'Robotique mBot',
    '10–14 ans',
    'intermediaire',
    'Capteurs, moteurs, logique robotique et préparation aux compétitions éducatives.',
    array['mBot', 'Arduino', 'Thymio'],
    750,
    '🤖',
    'cyan',
    2
  ),
  (
    'arduino-iot',
    'Arduino & IoT',
    '11–15 ans',
    'intermediaire',
    'Électronique, objets connectés, Raspberry Pi et prototypes intelligents.',
    array['Arduino', 'Raspberry Pi', 'Dadabit AI'],
    850,
    '💡',
    'amber',
    3
  ),
  (
    'python-data',
    'Python & Data',
    '12–16 ans',
    'avance',
    'Python moderne, données, visualisation et automatisation utile pour les adolescents.',
    array['Python', 'VS Code', 'Pandas'],
    850,
    '🐍',
    'green',
    4
  ),
  (
    'web-development',
    'Web Development',
    '13–17 ans',
    'avance',
    'Sites web, interfaces responsives, JavaScript et premières applications React.',
    array['HTML/CSS', 'JavaScript', 'React'],
    900,
    '🌐',
    'rose',
    5
  ),
  (
    'intelligence-artificielle',
    'Intelligence Artificielle',
    '14–17 ans',
    'avance',
    'Vision, machine learning, projets IA éducatifs et robotique VinciBot.',
    array['VinciBot', 'Dadabit AI', 'Python ML'],
    950,
    '🧠',
    'purple',
    6
  )
on conflict (id) do update set
  title = excluded.title,
  age_range = excluded.age_range,
  level = excluded.level,
  description = excluded.description,
  tools = excluded.tools,
  price_monthly = excluded.price_monthly,
  icon = excluded.icon,
  color = excluded.color,
  sort_order = excluded.sort_order;
