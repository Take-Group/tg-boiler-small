# tg-boiler-small

Szablon Take Group do stron i małych appek, które budujesz z Claude Code
albo Codexem. Programować nie trzeba.

## Jak zacząć

1. Otwórz Claude Code albo Codex w dowolnym folderze.
2. Skopiuj prompt poniżej i wklej go.
3. Odpowiadaj na pytania. Agent pobierze projekt, zainstaluje, co trzeba,
   i przejdzie z Tobą całą konfigurację: cel strony, funkcje, podstrony,
   markę, domenę i wygląd. Niczego nie zbuduje, dopóki nie zatwierdzisz
   planu.

```text
Załóż mi nowy projekt z szablonu Take Group tg-boiler-small i od razu
przeprowadź mnie przez jego konfigurację. Rozmawiaj ze mną po polsku,
prostym językiem, bez żargonu.

1. Sprawdź, czy mam git, bun i gh (GitHub CLI). Brakujące zainstaluj
   albo powiedz mi dokładnie, co wpisać. Jeśli `gh auth status` pokazuje,
   że nie jestem zalogowany, poproś, żebym się zalogował przez
   `gh auth login`, i poczekaj.
2. Zapytaj mnie tylko o nazwę folderu projektu i zaproponuj
   ~/projects/<nazwa>. Nie nadpisuj istniejącego folderu.
3. Pobierz szablon:
   gh repo clone Take-Group/tg-boiler-small <folder> -- --depth 1
   Potem w tym folderze usuń katalog .git i załóż nowe repo (git init),
   żeby projekt był mój, a nie kopią szablonu.
4. W folderze projektu uruchom `bun install` i
   `bunx playwright install chromium` (do zrzutów ekranu).
5. Przeczytaj AGENTS.md i .agents/skills/onboarding/SKILL.md z folderu
   projektu i wykonaj skill onboarding od początku do końca: tryb
   planowania, wywiad ze mną, plan do zatwierdzenia, a po akceptacji
   konfiguracja projektu. Wszystkie pliki zmieniaj w folderze projektu.
6. Na koniec powiedz mi, w jakim folderze otwierać Claude Code albo Codex
   przy kolejnej pracy nad tym projektem.
```

Potrzebujesz konta na GitHubie z dostępem do organizacji `Take-Group`.

## Co dalej

Kolejne sesje otwieraj w folderze projektu. Agent sam zna zasady tego
repo. Przykładowe prośby:

- "Pokaż mi, jak wygląda strona główna na telefonie."
- "Dodaj stronę Cennik z tabelą trzech pakietów."
- "Za dużo tekstu na stronie głównej, skróć."
- "Zmień kolor przewodni na zielony jak w logo."
- "Dodaj kalkulator ceny." (agent powie, ile to waży, zanim zacznie)
- "Zapisz zmiany i wyślij na GitHuba."
- "Coś się rozjechało na stronie O nas, sprawdź."

Wygląd i ton strony są opisane w `DESIGN.md`. To Twój design playbook:
możesz go czytać i poprawiać.

## Dla agentów

Zasady są w `AGENTS.md` (Claude Code czyta je przez `CLAUDE.md`), procedury
w `.agents/skills/`.
