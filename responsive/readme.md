Strona została wystylowana w scss, tak jak zostało to zalecone. Po raz pierwszy korzystałem z scss i muszę przyznać, że pisze się wygodniej niż w zwykłym css-ie. Do ustalania szerokości sekcji napisałem funkcję get-width($cols), która zwraca szerokość kolumny przy założeniu układu o $cols kolumnach. Ze zrzutów ekranu strony przy różnych szerokościach odzyskałem względne szerokości marginesów i na ich podstawie obliczam szerokość kolumny. Marginesy są trzymane w mapie, gdzie kluczem jest literka odpowiadająca wielkości urządzenia - rozwiązanie lepsze od listy, gdyż wtedy trzeba by pamiętać numery odpowiadające danym układom.

Skorzystałem także z instrukcji import (importuję nią reset.scss). Dzięki temu wszystkie reguły stylowania ładowane na stronie są w jednym pliku, co zmniejsza liczbę żądań.
Korzystałem też ze zmiennych i zagnieżdżania reguł.

Nie miałem pomysłu w jaki sposób stworzyć ikonkę menu bez dodawania nowych elementów html nie posiadających znaczenia semantycznego (pseudoelementy ::before i ::after są tylko 2, co uniemożliwiałoby dodanie 3 linii). Jednak szukając pomysłów w Internecie napotkałem na sugestię, żeby użyć cieni do wygenerowania dodatkowych linii. Na podstawie tego pomysłu sam napisałem ikonkę menu.

Układ strony został zrobiony na flexboxach. Spotkałem się już z nimi wcześniej, ale zadanie było dobrą okazją do przećwiczenia tematu.